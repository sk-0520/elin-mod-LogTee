import { create } from 'zustand';
import type { ModeKind } from '../types/mode';

export interface ModeState {
  mode: ModeKind;
}
export interface ModeActions {
  setMode: (mode: ModeKind) => void;
}

export type ModeStore = ModeState & ModeActions;

const DefaultState: ModeState = {
  mode: 'none',
};

export const useModeStore = create<ModeStore>()((set, _get) => {
  return {
    ...DefaultState,

    setMode: (mode: ModeKind) => {
      set({ mode });
    },
  };
});
