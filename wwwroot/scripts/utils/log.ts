import { usePopupStore } from '../hooks/usePopupStore';
import {
	type LogItem,
	LogItemScheme,
	type ModMessage,
	type ModMessageKind,
} from '../types/csharp';
import type {
	ParsedHighlightItemSetting,
	ParsedHighlightSetting,
} from '../types/highlight';
import { dump, get } from './access';
import { convertHtmlFromLogMessage, convertStyleColor } from './converter';
import {
	createLogItemElementByTemplate,
	createModMessageWithDetailElementByTemplate,
	createModMessageWithoutDetailElementByTemplate,
	ensureSelector,
	getLogElement,
} from './dom';
import type { Language } from './language';

const DefaultColor = '#fff';
let LastColor: string | undefined;

function hitHighlight(
	text: string,
	highlightSetting: ParsedHighlightSetting,
): ParsedHighlightItemSetting | undefined {
	for (const highlightItem of highlightSetting.items) {
		if (highlightItem.match === 'regex') {
			if (highlightItem.regex.test(text)) {
				return highlightItem;
			}
		} else {
			const sourceText = highlightItem.ignoreCase ? text.toLowerCase() : text;
			const patternText = highlightItem.ignoreCase
				? highlightItem.text.toLowerCase()
				: highlightItem.text;

			switch (highlightItem.match) {
				case 'contains':
					if (sourceText.includes(patternText)) {
						return highlightItem;
					}
					break;

				case 'startsWith':
					if (sourceText.startsWith(patternText)) {
						return highlightItem;
					}
					break;

				case 'endsWith':
					if (sourceText.endsWith(patternText)) {
						return highlightItem;
					}
					break;

				case 'equals':
					if (sourceText === patternText) {
						return highlightItem;
					}
					break;

				default:
					// @ts-expect-error
					throw new Error(highlightItem.match);
			}
		}
	}

	return undefined;
}

export function getLogItemId(uuid: string): string {
	return `log-item-${uuid}`;
}

function createLogItemElement(
	logItem: LogItem,
	color: string,
	highlightSetting: ParsedHighlightSetting,
	_language: Language,
): HTMLElement | undefined {
	if (logItem.message.kind === 'NewLine') {
		return document.createElement('br');
	}

	if (!logItem.message.message) {
		return undefined;
	}

	const logItemElement = createLogItemElementByTemplate();

	logItemElement.id = getLogItemId(logItem.uuid);
	logItemElement.style.color = color;
	logItemElement.append(
		convertHtmlFromLogMessage(logItem.message.message, 'log'),
	);
	logItemElement.dataset.log = JSON.stringify(logItem);

	// ハイライト
	const highlightItem = hitHighlight(logItem.message.message, highlightSetting);
	if (highlightItem) {
		switch (highlightItem.display) {
			case 'inline':
				logItemElement.classList.add('log-item-highlight-inline');
				logItemElement.style.borderColor = color;
				break;

			case 'block':
				logItemElement.classList.add('log-item-highlight-block');
				logItemElement.style.borderColor = color;
				break;

			case 'popup':
				logItemElement.classList.add('log-item-highlight-popup');
				logItemElement.style.borderColor = color;
				usePopupStore.getState().enqueueLog(logItem);
				break;
		}
	}

	return logItemElement;
}

function createModMessageElement(
	kind: ModMessageKind,
	message: keyof Language,
	details: object | undefined,
	_timestamp: Date,
	language: Language,
): HTMLElement {
	const rootElement = details
		? createModMessageWithDetailElementByTemplate()
		: createModMessageWithoutDetailElementByTemplate();

	const messageElement = ensureSelector(rootElement, '.mod-message-message');
	messageElement.textContent = language[message];
	if (details) {
		const detailElement = ensureSelector(rootElement, '.mod-message-detail');
		detailElement.textContent = JSON.stringify(dump(details), null, 2);
	}

	rootElement.classList.add(
		'mod-message',
		`mod-message-kind-${kind.toLowerCase()}`,
	);
	return rootElement;
}

function addLogItemCore(
	logItem: LogItem,
	highlightSetting: ParsedHighlightSetting,
	language: Language,
): HTMLElement | undefined {
	const logElement = getLogElement();

	if (
		logItem.message.kind === 'Color' ||
		logItem.message.kind === 'MessageWithColor'
	) {
		LastColor = convertStyleColor(logItem.message.color);
		if (logItem.message.kind === 'Color') {
			return;
		}
	}

	if (logItem.message.kind === 'Mod') {
		const modMessage = get(logItem.message.mod); //TODO: 型で非 undefined にできるはずだけど一旦これでいい
		const modMessageElement = createModMessageElement(
			modMessage.kind,
			modMessage.messageId,
			modMessage.details,
			logItem.logTimestamp,
			language,
		);
		logElement.appendChild(modMessageElement);
		return modMessageElement;
	}

	const logItemElement = createLogItemElement(
		logItem,
		LastColor ?? DefaultColor,
		highlightSetting,
		language,
	);
	if (logItemElement) {
		if (
			logItemElement instanceof HTMLBRElement &&
			logElement.lastChild instanceof HTMLBRElement
		) {
			return undefined;
		}
		logElement.appendChild(logItemElement);
		return logItemElement;
	}

	return undefined;
}

export function addLogItem(
	logItem: LogItem,
	highlightSetting: ParsedHighlightSetting,
	language: Language,
) {
	const element = addLogItemCore(logItem, highlightSetting, language);
	if (element) {
		element.scrollIntoView();
	}
}

export function addLogItems(
	logItems: LogItem[],
	highlightSetting: ParsedHighlightSetting,
	language: Language,
) {
	let lastElement: HTMLElement | undefined;
	for (const logItem of logItems) {
		const element = addLogItemCore(logItem, highlightSetting, language);
		if (element) {
			lastElement = element;
		}
	}
	if (lastElement) {
		lastElement.scrollIntoView();
	}
}

export function addModMessage(message: ModMessage, language: Language) {
	const messageElement = createModMessageElement(
		message.kind,
		message.messageId,
		message.details,
		new Date(),
		language,
	);
	const logElement = getLogElement();
	logElement.appendChild(messageElement);
	messageElement.scrollIntoView();
}

export function clearLog() {
	const logElement = getLogElement();
	logElement.textContent = '';
	usePopupStore.getState().clearLogs();
}

export function removeHeadElements(target: HTMLElement, limit: number) {
	while (limit < target.childElementCount) {
		console.debug({ firstElementChild: target.firstElementChild });
		const firstElementChild = target.firstElementChild;
		if (firstElementChild) {
			if (firstElementChild instanceof HTMLElement) {
				const rawLog = firstElementChild.dataset.log;
				if (rawLog) {
					const result = LogItemScheme.safeParse(JSON.parse(rawLog));
					if (result.success) {
						const logItem = result.data;
						usePopupStore.getState().removeLog(logItem.uuid);
					}
				}
			}
			firstElementChild.remove();
		}
	}
}
