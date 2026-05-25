import type { ParsedHighlightSetting } from '../types/highlight';
import { joinEndpoint } from '../utils/api';
import type { Language } from '../utils/language';
import { EventSourceReceiver } from '../utils/sse';

export default function getFileStream(
	elementLimit: number,
	highlightSetting: ParsedHighlightSetting,
	language: Language,
): EventSourceReceiver {
	return new EventSourceReceiver(
		joinEndpoint('/api/stream/file'),
		'file',
		elementLimit,
		highlightSetting,
		language,
	);
}
