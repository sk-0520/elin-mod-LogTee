import { create } from 'zustand';
import type { FrontendSetting } from '../types/csharp';
import {
	HighlightPopupSettingSchema,
	type ParsedHighlightSetting,
} from '../types/highlight';
import { applyFrontendSetting, parseHighlightSetting } from '../utils/setting';

export interface FrontendSettingState {
	setting: FrontendSetting;
	highlight: ParsedHighlightSetting;
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
		highlightV2: '',
	},
	highlight: {
		popup: HighlightPopupSettingSchema.parse(undefined),
		items: [],
	},
};

export const useFrontendSettingStore = create<FrontendSettingStore>()(
	(set, _get) => {
		return {
			...DefaultState,

			setSetting: (setting: FrontendSetting) => {
				const highlightSetting = parseHighlightSetting(setting.highlightV2);

				set({ setting: setting, highlight: highlightSetting });

				applyFrontendSetting(setting);
			},
		};
	},
);
