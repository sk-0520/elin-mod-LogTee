import { create } from 'zustand';
import type { LogItem } from '../types/csharp';
import {
	type HighlightPopupSetting,
	HighlightPopupSettingSchema,
} from '../types/highlight';

type TimeoutId = ReturnType<typeof setTimeout>;
const DisableAutoCloseTimeout = 0 as unknown as TimeoutId;

export interface PopupState {
	setting: HighlightPopupSetting;
	openDetail: boolean;
	autoCloseTimeoutId: TimeoutId;
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
	hasLogs: false,
	logs: [],
};

export const usePopupStore = create<PopupStore>()((set, get) => {
	const startAutoCloseTimeout = (delay: number): TimeoutId => {
		return setTimeout(() => {
			set({
				logs: [],
				hasLogs: false,
				autoCloseTimeoutId: DisableAutoCloseTimeout,
			});
		}, delay);
	};

	const stopAutoCloseTimeout = () => {
		const timeoutId = get().autoCloseTimeoutId;
		if (timeoutId !== DisableAutoCloseTimeout) {
			clearTimeout(timeoutId);
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

			set({ logs: newLogs, hasLogs: true, autoCloseTimeoutId: timeoutId });
		},

		clearLogs: () => {
			stopAutoCloseTimeout();
			set({
				logs: [],
				hasLogs: false,
				autoCloseTimeoutId: DisableAutoCloseTimeout,
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

				set({ logs: newLogs, hasLogs: hasLogs, autoCloseTimeoutId: timeoutId });
			}
		},
	};
});
