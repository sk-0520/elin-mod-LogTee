import { create } from 'zustand';
import type { FrontendSetting } from '../types/csharp';
import { applyFrontendSetting } from '../utils/setting';

export interface FrontendSettingState {
	setting: FrontendSetting;
}
export interface FrontendSettingActions {
	setSetting: (setting: FrontendSetting) => void;
}

export type FrontendSettingStore = FrontendSettingState &
	FrontendSettingActions;

const DefaultState: FrontendSettingState = {
	setting: {
		cssFontFamily: 'sans-serif',
		cssFontSize: '12px',
		elementLimit: 4 * 1024,
	},
};

export const useFrontendSettingStore = create<FrontendSettingStore>()(
	(set, _get) => {
		return {
			...DefaultState,

			setSetting: (setting: FrontendSetting) => {
				set({ setting });
				applyFrontendSetting(setting);
			},
		};
	},
);
