import { create } from 'zustand';
import type { LogItem } from '../types/csharp';
import {
	type HighlightPopupSetting,
	HighlightPopupSettingSchema,
} from '../types/highlight';

type TimeoutId = ReturnType<typeof setTimeout>;
const DisableAutoCloseTimeout = 0 as unknown as TimeoutId;
const IntervalTime = 100; // 60fps に近づけるなら 1000 / 60 を設定。

export interface PopupState {
	setting: HighlightPopupSetting;
	openDetail: boolean;

	autoCloseTimeoutId: TimeoutId;
	autoCloseProgressTimeoutId: TimeoutId;
	startTimer: Date | undefined;
	timeoutProgress: number;

	hasLogs: boolean;
	logs: LogItem[];
}
export interface PopupActions {
	setSetting: (setting: HighlightPopupSetting) => void;
	setOpenDetail: (open: boolean) => void;
	enqueueLog: (log: LogItem) => void;
	clearLogs: () => void;
	removeLog: (uuid: string) => void;
}

export type PopupStore = PopupState & PopupActions;

const DefaultState: PopupState = {
	setting: HighlightPopupSettingSchema.parse(undefined),
	openDetail: true,
	autoCloseTimeoutId: DisableAutoCloseTimeout,
	autoCloseProgressTimeoutId: DisableAutoCloseTimeout,
	startTimer: undefined,
	timeoutProgress: 0,
	hasLogs: false,
	logs: [],
};

export const usePopupStore = create<PopupStore>()((set, get) => {
	const startAutoCloseTimeout = (delay: number): TimeoutId => {
		const autoCloseProgressTimeoutId = setInterval(() => {
			const startTimer = get().startTimer;
			if (startTimer) {
				const now = new Date();
				const elapsed = now.getTime() - startTimer.getTime();
				const progress = Math.min(elapsed / delay, 1);
				console.debug('Auto close progress:', progress);
				set({
					timeoutProgress: progress,
					autoCloseProgressTimeoutId: autoCloseProgressTimeoutId,
				});
			}
		}, IntervalTime);

		return setTimeout(() => {
			set({
				logs: [],
				hasLogs: false,
				autoCloseTimeoutId: DisableAutoCloseTimeout,
				autoCloseProgressTimeoutId: DisableAutoCloseTimeout,
				startTimer: new Date(),
				timeoutProgress: 0,
			});
		}, delay);
	};

	const stopAutoCloseTimeout = () => {
		const timeoutId = get().autoCloseTimeoutId;
		if (timeoutId !== DisableAutoCloseTimeout) {
			clearTimeout(timeoutId);
		}
		const progressTimeoutId = get().autoCloseProgressTimeoutId;
		if (progressTimeoutId !== DisableAutoCloseTimeout) {
			clearInterval(progressTimeoutId);
		}
	};

	return {
		...DefaultState,

		setSetting: (setting: HighlightPopupSetting) => {
			set({ setting: setting });
		},

		setOpenDetail(open: boolean) {
			set({ openDetail: open });
		},

		enqueueLog: (log: LogItem) => {
			stopAutoCloseTimeout();

			const setting = get().setting;
			const logs = get().logs;
			const newLogs = [...logs, log].slice(-setting.limit);

			const timeoutId = setting.autoClose
				? startAutoCloseTimeout(setting.autoCloseDelay)
				: DisableAutoCloseTimeout;

			set({
				logs: newLogs,
				hasLogs: true,
				autoCloseTimeoutId: timeoutId,
				startTimer: setting.autoClose ? new Date() : undefined,
				timeoutProgress: 0,
			});
		},

		clearLogs: () => {
			stopAutoCloseTimeout();
			set({
				logs: [],
				hasLogs: false,
				autoCloseTimeoutId: DisableAutoCloseTimeout,
				startTimer: undefined,
				timeoutProgress: 0,
			});
		},

		removeLog: (uuid: string) => {
			const logs = get().logs;
			const newLogs = logs.filter((log) => log.uuid !== uuid);
			// 長さが同じならば削除されていないので更新しない
			if (logs.length !== newLogs.length) {
				const hasLogs = 0 < newLogs.length;
				let timeoutId = get().autoCloseTimeoutId;
				if (!hasLogs) {
					stopAutoCloseTimeout();
					timeoutId = DisableAutoCloseTimeout;
				}

				set({
					logs: newLogs,
					hasLogs: hasLogs,
					autoCloseTimeoutId: timeoutId,
				});
			}
		},
	};
});
