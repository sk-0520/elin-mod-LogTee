import type { ModMessageId } from '../types/csharp';
import type { ModeKind } from '../types/mode';
import LanguageItems from './languageItems';

export interface LanguageItem {
	jp: string;
	en: string;
	cn?: string;
	zhtw?: string;
	kr?: string;
}

export type Language = {
	[key in keyof typeof LanguageItems]: string;
};

const FallbackGameLanguage = 'en';
const GameLanguages = new Set(['jp', 'en', 'cn', 'zhtw', 'kr']);
const NavigatorLanguages = new Map([
	['ja', 'jp'],
	['ja-JP', 'jp'],
	['en', 'en'],
	['en-US', 'en'],
	['en-GB', 'en'],
	['zh', 'cn'],
	['zh-TW', 'zhtw'],
	['zh-CN', 'cn'],
	['zh-Hans', 'cn'],
	['zh-Hant', 'zhtw'],
	['ko', 'kr'],
	['ko-KR', 'kr'],
]);

export function getLanguageByGameLanguage(gameLanguage: string): Language {
	const result: Language = Object.fromEntries(
		Object.entries(LanguageItems).map(([key, item]) => {
			const primary = {
				jp: item.jp,
				en: item.en,
			};

			//@ts-expect-error
			let target: string | undefined = item[gameLanguage as keyof LanguageItem];
			if (!target) {
				if (primary.en) {
					target = primary.en;
				} else {
					target = primary.jp;
				}
			}

			return [key, target];
		}),
	) as Language; // ん～、わからん！

	return result;
}

export function getLanguage(gameLanguage: string | undefined): Language {
	let lang = gameLanguage?.toLowerCase() ?? '';
	if (!GameLanguages.has(lang)) {
		const navigatorLanguage = navigator.language.toLowerCase();
		lang = NavigatorLanguages.get(navigatorLanguage) ?? FallbackGameLanguage;
	}
	const language = lang ?? FallbackGameLanguage;
	return getLanguageByGameLanguage(language);
}

export function getBrowserLanguage(_gameLanguage: string | undefined): string {
	//TODO: ゲーム側言語に合わせる
	return navigator.language;
}

type ModeTextId = keyof Pick<
	Language,
	| 'mode.enum.none'
	| 'mode.enum.stream-socket'
	| 'mode.enum.stream-file'
	| 'mode.enum.upload'
>;

type ModMessageIdTextId = keyof Pick<Language, ModMessageId>;

export function toTextId(mode: ModeKind): ModeTextId;
export function toTextId(mode: ModMessageId): ModMessageIdTextId;
export function toTextId(
	input: ModeKind | ModMessageId,
): ModeTextId | ModMessageIdTextId {
	switch (input) {
		// ModeKind
		case 'none':
			return 'mode.enum.none';
		case 'stream-file':
			return 'mode.enum.stream-file';
		case 'stream-socket':
			return 'mode.enum.stream-socket';
		case 'upload':
			return 'mode.enum.upload';

		// ModMessageIdTextId は同じ値となる
		default:
			return input;
	}
}

export function format(
	source: string,
	map: Record<string, string | number>,
): string {
	const regex = /\${(.+)}/g;
	return source.replace(regex, (_, key) => {
		const value = map[key] ?? '';

		if (typeof value === 'string') {
			return value;
		}

		return String(value);
	});
}
