import { create } from 'zustand';
import { Environment } from '../utils/env';
import { getLanguageByGameLanguage, type Language } from '../utils/language';

export interface LanguageState {
	language: Language;
}

export interface LanguageActions {
	setLanguage: (language: Language) => void;
	getText: (key: keyof Language) => string;
	unsafeGetText: (key: string) => string;
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
				getText: (a) => store.getText(a),
				unsafeGetText: (a) => store.unsafeGetText(a),
			});
		},

		getText: (key: keyof Language) => {
			const state = get();
			return state.language[key];
		},

		unsafeGetText: (key: string) => {
			const state = get();
			let result = state.language[key as keyof Language];
			if (result === undefined) {
				console.warn(`Language key "${key}" is not defined.`);
			}
			if (Environment.isDebug) {
				if (result === undefined) {
					throw new Error(`Language key "${key}" is not defined.`);
				}
			}
			result ??= key;
			return result;
		},
	};
});
