import { create } from 'zustand';

export interface BusyState {
  isBusy: boolean;
}
export interface BusyActions {
  setBusy: (isBusy: boolean) => void;
  clearBusy: () => void;
  busyBlock: <T>(action: () => Promise<T>) => Promise<T>;
}

export type BusyStore = BusyState & BusyActions;

const DefaultState: BusyState = {
  isBusy: false,
};

export const useBusyStore = create<BusyStore>()((set, _get) => {
  return {
    ...DefaultState,

    setBusy: (isBusy: boolean) => {
      set({ isBusy });
    },

    clearBusy: () => {
      set({ isBusy: false });
    },

    busyBlock: async <T>(action: () => Promise<T>) => {
      set({ isBusy: true });

      try {
        return await action();
      } finally {
        set({ isBusy: false });
      }
    },
  };
});
