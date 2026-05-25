import { create } from 'zustand';
import type { LogItem } from '../types/csharp';
import { HighlightDefaultPopupLimit } from '../utils/setting';

export interface PopupState {
	limit: number;
	openDetail: boolean;
	hasLogs: boolean;
	logs: LogItem[];
}
export interface PopupActions {
	setLimit: (limit: number) => void;
	setOpenDetail: (open: boolean) => void;
	enqueueLog: (log: LogItem) => void;
	clearLogs: () => void;
	removeLog: (uuid: string) => void;
}

export type PopupStore = PopupState & PopupActions;

const DefaultState: PopupState = {
	limit: HighlightDefaultPopupLimit,
	openDetail: true,
	hasLogs: false,
	logs: [],
};

export const usePopupStore = create<PopupStore>()((set, get) => {
	return {
		...DefaultState,

		setLimit: (limit: number) => {
			set({ limit: limit });
		},

		setOpenDetail(open: boolean) {
			set({ openDetail: open });
		},

		enqueueLog: (log: LogItem) => {
			const limit = get().limit;
			const logs = get().logs;
			const newLogs = [...logs, log].slice(-limit);
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
