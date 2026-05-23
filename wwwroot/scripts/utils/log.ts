import type { LogItem, ModMessage, ModMessageKind } from '../types/csharp';
import { dump, get } from './access';
import { convertStyleColor } from './converter';
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

function createLogItemElement(
	logItem: LogItem,
	color: string,
	_language: Language,
): HTMLElement | undefined {
	if (logItem.message.kind === 'NewLine') {
		return document.createElement('br');
	}

	if (!logItem.message.message) {
		return undefined;
	}

	const logItemElement = createLogItemElementByTemplate();

	logItemElement.style.color = color;
	// TODO: まぁローカルで脆弱性があるだけなので、勘弁してくれ
	logItemElement.innerHTML = logItem.message.message;

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

export function addLogItem(logItem: LogItem, language: Language) {
	const element = addLogItemCore(logItem, language);
	if (element) {
		element.scrollIntoView();
	}
}

export function addLogItems(logItems: LogItem[], language: Language) {
	let lastElement: HTMLElement | undefined;
	for (const logItem of logItems) {
		const element = addLogItemCore(logItem, language);
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
}

export function removeHeadElements(target: HTMLElement, limit: number) {
	while (limit < target.childElementCount) {
		console.debug({ firstChild: target.firstChild });
		target.firstChild?.remove();
	}
}
