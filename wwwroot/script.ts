import ReactDOM from 'react-dom/client';
import { createReactRootElement, ensureElementById } from './scripts/utils/dom';
import './style.css';
import React from 'react';
import { getSetting } from './scripts/api/getSetting';
import ToolbarContainer from './scripts/ToolbarContainer';
import { Environment } from './scripts/utils/env';
import { applyFrontendSetting } from './scripts/utils/setting';

// ツールバー側構築
const toolbarContainerElement = ReactDOM.createRoot(
  ensureElementById('toolbar-container'),
);

toolbarContainerElement.render(
  createReactRootElement(
    React.createElement(ToolbarContainer),
    Environment.isDebug,
  ),
);

setTimeout(async () => {
  try {
    const settingResult = await getSetting();
    const setting = settingResult.setting;
    applyFrontendSetting(setting.frontend);
  } catch (error) {
    console.error('Failed to get setting', error);
  }
}, 0);
