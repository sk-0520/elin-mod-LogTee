import ReactDOM from 'react-dom/client';
import { ensureElementById } from './scripts/utils/dom';
import './style.css';
import React, { StrictMode } from 'react';
import { getSetting } from './scripts/api/getSetting';
import { useFrontendSettingStore } from './scripts/hooks/useFrontendSetting';
import { usePopupStore } from './scripts/hooks/usePopupStore';
import PopupApp from './scripts/PopupApp';
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

function createPopupApp(): void {
	// ポップアップ側構築
	const popupContainerElement = ReactDOM.createRoot(
		ensureElementById('popup-app'),
	);

	popupContainerElement.render(
		React.createElement(StrictMode, undefined, React.createElement(PopupApp)),
	);
}

function createApp(): void {
	createToolbarApp();
	createPopupApp();
}

async function boot(): Promise<void> {
	try {
		// ToolbarContainer.tsx: useEffect内でやるべきなんだろうけど、ログ周りは react 関係なさすぎるので無理やり対応
		const settingResult = await getSetting();
		const setting = settingResult.setting;

		useFrontendSettingStore.getState().setSetting(setting.frontend);
		usePopupStore
			.getState()
			.setLimit(useFrontendSettingStore.getState().highlight.popupLimit);
	} catch (error) {
		console.error('Failed to get setting', error);
	}

	setTimeout(createApp, 0);
}
boot();
