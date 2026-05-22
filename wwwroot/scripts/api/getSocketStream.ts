import { joinEndpoint } from '../utils/api';
import type { Language } from '../utils/language';
import { EventSourceReceiver } from '../utils/sse';

export default function getSocketStream(
  elementLimit: number,
  language: Language,
): EventSourceReceiver {
  return new EventSourceReceiver(
    joinEndpoint('/api/stream/socket'),
    'socket',
    elementLimit,
    language,
  );
}
