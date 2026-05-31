import { create } from 'zustand';
import { getLanguageByGameLanguage, type Language } from '../utils/language';

export interface LanguageState {
	language: Language;
}

export interface LanguageActions {
	setLanguage: (language: Language) => void;
}

export type LanguageStore = LanguageState & LanguageActions;

const DefaultState: LanguageState = {
	language: getLanguageByGameLanguage('EN'),
};

export const useLanguageStore = create<LanguageStore>()((set, _get) => {
	return {
		...DefaultState,

		setLanguage: (language: Language) => {
			set({
				language: language,
			});
		},
	};
});
