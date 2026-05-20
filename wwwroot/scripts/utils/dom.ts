let LogElement: HTMLElement | undefined;
let LogItemTemplateElement: HTMLTemplateElement | undefined;
let ModMessageTemplateElement: HTMLTemplateElement | undefined;

export function ensureElementById(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id ${id} not found`);
  }

  return element;
}

//#region ensureSelector
export function ensureSelector<K extends keyof HTMLElementTagNameMap>(
  element: ParentNode,
  selectors: K,
): HTMLElementTagNameMap[K];
export function ensureSelector<K extends keyof SVGElementTagNameMap>(
  element: ParentNode,
  selectors: K,
): SVGElementTagNameMap[K];
export function ensureSelector<K extends keyof MathMLElementTagNameMap>(
  element: ParentNode,
  selectors: K,
): MathMLElementTagNameMap[K];
export function ensureSelector<E extends Element = Element>(
  element: ParentNode,
  selectors: string,
): E;

export function ensureSelector<E extends Element = Element>(
  element: ParentNode,
  selectors: string,
): E {
  const targetElement = element.querySelector(selectors);
  if (!targetElement) {
    throw new Error(`Element with selectors ${selectors} not found`);
  }
  return targetElement as E;
}
//#endregion

export function getLogElement(): HTMLElement {
  LogElement ??= ensureElementById('log');
  return LogElement;
}

export function createLogItemElementByTemplate(): HTMLElement {
  LogItemTemplateElement ??= ensureElementById(
    'log-item-template',
  ) as HTMLTemplateElement;
  const clonedElement = LogItemTemplateElement.content.cloneNode(
    true,
  ) as HTMLElement;
  const logItemElement = clonedElement.firstElementChild as HTMLElement;
  return logItemElement;
}

export function createModMessageElementByTemplate(): HTMLElement {
  ModMessageTemplateElement ??= ensureElementById(
    'mod-message-template',
  ) as HTMLTemplateElement;
  const clonedElement = ModMessageTemplateElement.content.cloneNode(
    true,
  ) as HTMLElement;
  const modMessageElement = clonedElement.firstElementChild as HTMLElement;
  return modMessageElement;
}

export async function busy<T>(promise: () => Promise<T>): Promise<T> {
  try {
    // DOM 構築
    return await promise();
  } finally {
    // 構築 DOM 破棄
  }
}
