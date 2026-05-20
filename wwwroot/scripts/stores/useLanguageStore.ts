import { create } from 'zustand';
import { getLanguage, type Language } from '../utils/language';

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
  language: getLanguage(undefined), // TODO: ガン無視クエリ
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
      return state.language[key as keyof Language] ?? key;
    },
  };
});
