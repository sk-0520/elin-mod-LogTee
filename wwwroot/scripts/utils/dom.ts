let LogElement: HTMLElement | undefined;
let LogItemTemplateElement: HTMLTemplateElement | undefined;
let ModMessageTemplateWithDetailElement: HTMLTemplateElement | undefined;
let ModMessageTemplateWithoutDetailElement: HTMLTemplateElement | undefined;

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

export function createModMessageWithDetailElementByTemplate(): HTMLElement {
  ModMessageTemplateWithDetailElement ??= ensureElementById(
    'mod-message-template-with-detail',
  ) as HTMLTemplateElement;
  const clonedElement = ModMessageTemplateWithDetailElement.content.cloneNode(
    true,
  ) as HTMLElement;
  const modMessageElement = clonedElement.firstElementChild as HTMLElement;
  return modMessageElement;
}

export function createModMessageWithoutDetailElementByTemplate(): HTMLElement {
  ModMessageTemplateWithoutDetailElement ??= ensureElementById(
    'mod-message-template-without-detail',
  ) as HTMLTemplateElement;
  const clonedElement =
    ModMessageTemplateWithoutDetailElement.content.cloneNode(
      true,
    ) as HTMLElement;
  const modMessageElement = clonedElement.firstElementChild as HTMLElement;
  return modMessageElement;
}
