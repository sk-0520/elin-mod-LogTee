import { create } from 'zustand';
import type { EnableStreamTarget, StreamTarget } from '../types/stream';
import type { EventSourceReceiver } from '../utils/sse';

export interface StreamState {
	target: StreamTarget;
	receiver: EventSourceReceiver | undefined;
}

export interface StreamActions {
	setReceiver: (
		target: EnableStreamTarget,
		receiver: EventSourceReceiver,
	) => void;
	close(): void;
}

export type StreamStore = StreamState & StreamActions;

const DefaultState: StreamState = {
	target: 'none',
	receiver: undefined,
};

export const useStreamStore = create<StreamStore>()((set, get) => {
	return {
		...DefaultState,

		setReceiver: (
			target: EnableStreamTarget,
			receiver: EventSourceReceiver,
		) => {
			set({ target, receiver });
		},

		close: () => {
			get().receiver?.cleanup();
			set({ ...DefaultState });
		},
	};
});
