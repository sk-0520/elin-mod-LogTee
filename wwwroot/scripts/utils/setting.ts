import type { FrontendSetting } from '../types/csharp';
import {
	HighlightPopupSettingSchema,
	type HighlightSettingItem,
	HighlightSettingSchema,
	type ParsedHighlightItemSetting,
	type ParsedHighlightSetting,
	type ParsedPlainTextHighlightItemSetting,
} from '../types/highlight';
import { getLogElement } from './dom';

export function applyFrontendSetting(
	setting: Omit<FrontendSetting, 'highlight'>,
): void {
	const logElement = getLogElement();
	logElement.style.fontFamily = setting.cssFontFamily;
	logElement.style.fontSize = setting.cssFontSize;
}

function parsedHighlightItem(
	item: HighlightSettingItem,
): ParsedHighlightItemSetting {
	// if (item.match === 'regex') {
	// 	return {
	// 		id: crypto.randomUUID(),
	// 		display: item.display,
	// 		match: item.match,
	// 		ignoreCase: item.ignoreCase,
	// 		regex: new RegExp(item.pattern, item.ignoreCase ? 'i' : ''),
	// 	} satisfies ParsedRegexDynamicItemSetting;
	// }

	return {
		id: crypto.randomUUID(),
		display: item.display,
		match: item.match,
		ignoreCase: item.ignoreCase,
		text: item.pattern,
	} satisfies ParsedPlainTextHighlightItemSetting;
}

export function parseHighlightSetting(raw: string): ParsedHighlightSetting {
	if (raw) {
		const json = JSON.parse(raw);
		const rawHighlightSetting = HighlightSettingSchema.parse(json);

		const items = rawHighlightSetting.items.map(parsedHighlightItem);

		return { popup: rawHighlightSetting.popup, items: items };
	}

	return {
		popup: HighlightPopupSettingSchema.parse(undefined),
		items: [],
	};
}
