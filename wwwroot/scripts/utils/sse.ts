// SSE で一生データを受信するとブラウザが死ぬので制限する

import { useModeStore } from '../stores/useModeStore';
import { LogItemScheme } from '../types/csharp';
import { dump } from './access';
import { getLogElement } from './dom';
import type { Language } from './language';
import { addLogItem, addModMessage, removeHeadElements } from './log';

export class EventSourceReceiver {
  constructor(
    private readonly endpoint: string,
    private readonly target: 'socket' | 'file',
    readonly elementLimit: number,
    private readonly language: Language,
  ) {
    this.eventSource = new EventSource(endpoint);

    this.eventSource.addEventListener('open', this.onOpen);
    this.eventSource.addEventListener('error', this.onError);
    this.eventSource.addEventListener('message', this.onMessage);
  }

  private eventSource: EventSource;

  private readonly onOpen = (event: Event) => {
    addModMessage(
      {
        kind: 'Notice',
        messageId: `mod.message.id.stream-client-open`,
        details: {
          target: this.target,
          endpoint: this.endpoint,
          error: dump(event),
        },
      },
      this.language,
    );
  };

  private readonly onError = (event: Event) => {
    console.error('EventSource error', event);
    addModMessage(
      {
        kind: 'Error',
        messageId: `mod.message.id.stream-server-error`,
        details: {
          target: this.target,
          endpoint: this.endpoint,
          error: dump(event),
        },
      },
      this.language,
    );
    useModeStore.getState().setMode('none');
  };

  private readonly onMessage = (event: MessageEvent) => {
    const state = useModeStore.getState();
    if (state.mode === 'none') {
      state.setMode(this.target === 'socket' ? 'stream-socket' : 'stream-file');
    }

    this.doMessage(event.data);
  };

  private doMessage(data: string) {
    console.debug('onMessage', data);
    if (data) {
      const json = JSON.parse(data);
      const logItem = LogItemScheme.parse(json);

      addLogItem(logItem, this.language);
      removeHeadElements(getLogElement(), this.elementLimit);
    }
  }

  public cleanup() {
    if (this.eventSource) {
      this.eventSource.removeEventListener('open', this.onOpen);
      this.eventSource.removeEventListener('error', this.onError);
      this.eventSource.removeEventListener('message', this.onMessage);
      this.eventSource.close();
      this.eventSource = undefined as unknown as EventSource;
      addModMessage(
        {
          kind: 'Information',
          messageId: `mod.message.id.stream-client-stop`,
          details: { target: this.target, endpoint: this.endpoint },
        },
        this.language,
      );
    }
  }
}
