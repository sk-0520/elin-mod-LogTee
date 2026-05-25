import { create } from 'zustand';
import {
	format,
	getLanguageByGameLanguage,
	type Language,
} from '../utils/language';

export interface LanguageState {
	language: Language;
}

export interface LanguageActions {
	setLanguage: (language: Language) => void;
	getText: (key: keyof Language) => string;
	formatText: (
		key: keyof Language,
		map: Parameters<typeof format>[1],
	) => string;
}

export type LanguageStore = LanguageState & LanguageActions;

const DefaultState: LanguageState = {
	language: getLanguageByGameLanguage('EN'),
};

export const useLanguageStore = create<LanguageStore>()((set, get) => {
	return {
		...DefaultState,

		setLanguage: (language: Language) => {
			const store = get();
			set({
				language: { ...language },
				getText: (key) => store.getText(key),
				formatText: (key, map) => store.formatText(key, map),
			});
		},

		getText: (key: keyof Language) => {
			const state = get();
			return state.language[key];
		},

		formatText: (key: keyof Language, map: Parameters<typeof format>[1]) => {
			const state = get();
			const text = state.language[key];
			return format(text, map);
		},
	};
});
