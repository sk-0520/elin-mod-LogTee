import type {
  GameDateTime,
  LogItem,
  MessageColor,
  ModMessage,
  ModMessageKind,
} from '../types/csharp';
import { get } from './access';
import {
  createLogItemElementByTemplate,
  createModMessageElementByTemplate,
  ensureSelector,
  getLogElement,
} from './dom';
import type { Language } from './language';

const DefaultColor = '#fff';
let LastColor: string | undefined;

function convertStyleColor(color: MessageColor): string {
  const { r, g, b, a } = color;
  const styleColor = {
    r: 255 * r,
    g: 255 * g,
    b: 255 * b,
    a: a,
  };

  return `rgb(${styleColor.r} ${styleColor.g} ${styleColor.b} / ${styleColor.a})`;
}

function _convertGameTimestamp(timestamp: GameDateTime): string {
  const { year, month, day, hour, minute, second } = timestamp;

  const padded = {
    month: String(month).padStart(2, '0'),
    day: String(day).padStart(2, '0'),
    hour: String(hour).padStart(2, '0'),
    minute: String(minute).padStart(2, '0'),
    second: String(second).padStart(2, '0'),
  };
  return `${year}/${padded.month}/${padded.day} ${padded.hour}:${padded.minute}:${padded.second}`;
}

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
  message: string,
  details: object | undefined,
  _timestamp: Date,
  language: Language,
): HTMLElement {
  const messageElement = createModMessageElementByTemplate();

  const elements = {
    message: ensureSelector(messageElement, '.mod-message-message'),
    detail: ensureSelector(messageElement, '.mod-message-detail'),
  };

  elements.message.textContent = language[message] ?? message;
  if (details) {
    elements.detail.textContent = JSON.stringify(details, null, 2);
  } else {
    elements.detail.remove();
  }

  messageElement.classList.add(
    'mod-message',
    `mod-message-${kind.toLowerCase()}`,
  );
  return messageElement;
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
