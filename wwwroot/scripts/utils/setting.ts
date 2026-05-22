import type { FrontendSetting } from '../types/csharp';
import { getLogElement } from './dom';

export function applyFrontendSetting(setting: FrontendSetting): void {
  const logElement = getLogElement();
  logElement.style.fontFamily = setting.cssFontFamily;
  logElement.style.fontSize = setting.cssFontSize;
}
