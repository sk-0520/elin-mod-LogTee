import { ensureElementById } from './dom';
import type { Language } from './language';

export type StatusKind = 'none' | 'stream-file' | 'stream-socket' | 'upload';
let CurrentState: StatusKind = 'none';

export function setStatus(statusKind: StatusKind, language: Language): void {
  const stateElement = ensureElementById('status');
  stateElement.textContent =
    language[`status.enum.${statusKind}`] ?? statusKind;
  CurrentState = statusKind;
}

export function getStatus(): StatusKind {
  return CurrentState;
}
