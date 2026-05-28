import { create } from 'zustand';
import type { LogItem } from '../types/csharp';
import {
	type HighlightPopupSetting,
	HighlightPopupSettingSchema,
} from '../types/highlight';

export interface PopupState {
	setting: HighlightPopupSetting;
	openDetail: boolean;
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
	hasLogs: false,
	logs: [],
};

export const usePopupStore = create<PopupStore>()((set, get) => {
	return {
		...DefaultState,

		setSetting: (setting: HighlightPopupSetting) => {
			set({ setting: setting });
		},

		setOpenDetail(open: boolean) {
			set({ openDetail: open });
		},

		enqueueLog: (log: LogItem) => {
			const setting = get().setting;
			const logs = get().logs;
			const newLogs = [...logs, log].slice(-setting.limit);
			set({ logs: newLogs, hasLogs: true });
		},

		clearLogs: () => {
			set({ logs: [], hasLogs: false });
		},

		removeLog: (uuid: string) => {
			const logs = get().logs;
			const newLogs = logs.filter((log) => log.uuid !== uuid);
			// 長さが同じならば削除されていないので更新しない
			if (logs.length !== newLogs.length) {
				set({ logs: newLogs, hasLogs: 0 < newLogs.length });
			}
		},
	};
});
