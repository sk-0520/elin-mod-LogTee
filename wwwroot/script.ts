import ReactDOM from 'react-dom/client';
import { ensureElementById } from './scripts/utils/dom';
import './style.css';
import React, { StrictMode } from 'react';
import { getSetting } from './scripts/api/getSetting';
import { useFrontendSettingStore } from './scripts/stores/useFrontendSetting';
import ToolbarApp from './scripts/ToolbarApp';

function createToolbarApp(): void {
	// ツールバー側構築
	const toolbarContainerElement = ReactDOM.createRoot(
		ensureElementById('toolbar-app'),
	);

	toolbarContainerElement.render(
		React.createElement(StrictMode, undefined, React.createElement(ToolbarApp)),
	);
}

function createApp(): void {
	createToolbarApp();
}

async function boot(): Promise<void> {
	try {
		// ToolbarContainer.tsx: useEffect内でやるべきなんだろうけど、ログ周りは react 関係なさすぎるので無理やり対応
		const settingResult = await getSetting();
		const setting = settingResult.setting;
		useFrontendSettingStore.getState().setSetting(setting.frontend);
	} catch (error) {
		console.error('Failed to get setting', error);
	}

	setTimeout(createApp, 0);
}
boot();
