import ReactDOM from 'react-dom/client';
import { ensureElementById } from './scripts/utils/dom';
import './style.css';
import React, { StrictMode } from 'react';
import { getSetting } from './scripts/api/getSetting';
import ToolbarContainer from './scripts/ToolbarContainer';
import { Environment } from './scripts/utils/env';
import { applyFrontendSetting } from './scripts/utils/setting';

// ツールバー側構築
const toolbarContainerElement = ReactDOM.createRoot(
  ensureElementById('toolbar-container'),
);

toolbarContainerElement.render(
  Environment.isDebug
    ? React.createElement(
        StrictMode,
        undefined,
        React.createElement(ToolbarContainer),
      )
    : React.createElement(ToolbarContainer),
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
