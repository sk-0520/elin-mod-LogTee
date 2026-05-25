import z from 'zod';

export const HighlightDisplaySchema = z.enum(['inline', 'block', 'popup']);
export type HighlightDisplay = z.infer<typeof HighlightDisplaySchema>;

export const HighlightMatchSchema = z.enum([
	'contains',
	'startsWith',
	'endsWith',
	'equals',
	'regex',
]);
export type HighlightMatch = z.infer<typeof HighlightMatchSchema>;

export const HighlightSettingItemSchema = z.object({
	display: HighlightDisplaySchema,
	match: HighlightMatchSchema,
	ignoreCase: z.boolean().default(false),
	pattern: z.string(),
});
export type HighlightSettingItem = z.infer<typeof HighlightSettingItemSchema>;

export type HighlightSettingWithId = HighlightSettingItem & {
	id: string;
};

export const HighlightSettingSchema = z.object({
	popupLimit: z.number().nonnegative(),
	items: z.array(HighlightSettingItemSchema),
});
export type HighlightSetting = z.infer<typeof HighlightSettingSchema>;

interface ParsedItemSetting {
	id: string;
	display: HighlightDisplay;
}

export interface ParsedPlainTextHighlightItemSetting extends ParsedItemSetting {
	match: Exclude<HighlightMatch, 'regex'>;
	ignoreCase: boolean;
	text: string;
}

export interface ParsedRegexDynamicItemSetting extends ParsedItemSetting {
	match: 'regex';
	ignoreCase: boolean;
	regex: RegExp;
}

export type ParsedHighlightItemSetting =
	| ParsedPlainTextHighlightItemSetting
	| ParsedRegexDynamicItemSetting;

export interface ParsedHighlightSetting {
	popupLimit: number;
	readonly items: ParsedHighlightItemSetting[];
}
