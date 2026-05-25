import { create } from 'zustand';

export interface ErrorNotifyState {
	hasError: boolean;
	message: string;
	details: object | undefined;
}
export interface ErrorNotifyActions {
	setError: (error: unknown) => void;
	setException: (error: Error) => void;
	setErrorMessage: (message: string, details?: object) => void;
	clearError: () => void;
}

export type ErrorNotifyStore = ErrorNotifyState & ErrorNotifyActions;

const DefaultState: ErrorNotifyState = {
	hasError: false,
	message: '',
	details: undefined,
};

export const useErrorNotifyStore = create<ErrorNotifyStore>()((set, get) => {
	return {
		...DefaultState,

		setError: (error: unknown) => {
			if (error instanceof Error) {
				get().setException(error);
			} else {
				set({ hasError: true, message: `{error}`, details: undefined });
			}
		},

		setException: (error: Error) => {
			set({
				hasError: true,
				message: error.message,
				details: { name: error.name, stack: error.stack },
			});
		},

		setErrorMessage: (message: string, details?: object) => {
			set({ hasError: true, message, details });
		},

		clearError: () => {
			set({ hasError: false });
		},
	};
});
