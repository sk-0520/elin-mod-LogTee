import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
	Box,
	Button,
	FormControlLabel,
	IconButton,
	MenuItem,
} from '@mui/material';
import type { FC } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { useLanguageStore } from '../../../../../hooks/useLanguageStore';
import type { FrontendSetting } from '../../../../../types/csharp';
import {
	HighlightDisplaySchema,
	HighlightMatchSchema,
	HighlightPopupSettingSchema,
	type HighlightSettingItem,
	type HighlightSettingWithId,
} from '../../../../../types/highlight';
import { Environment } from '../../../../../utils/env';
import {
	ruleMax,
	ruleMin,
	ruleRequired,
	ValidationRules,
} from '../../../../../utils/forms';
import { format } from '../../../../../utils/language';
import type { SettingFormData } from '../EditorContainer';
import {
	EditorCheckbox,
	EditorNumberTextField,
	EditorSelect,
	EditorTextField,
} from '../EditorControls';
import EditorGroup from '../EditorGroup';
import ErrorMessage from '../ErrorMessage';
import SettingDescription from '../SettingDescription';

type HighlightItemAddMode = 'head' | 'tail';

const DefaultHighlightPopupSetting =
	HighlightPopupSettingSchema.parse(undefined);

export interface FrontendGroupProps {
	default: FrontendSetting;
}

const FrontendGroup: FC<FrontendGroupProps> = (props) => {
	const language = useLanguageStore((a) => a.language);
	const { control, watch } = useFormContext<SettingFormData>();

	const { insert, append, remove, move } = useFieldArray({
		control,
		name: 'highlight.items',
	});

	const handleAddHighlightItem = (
		data: HighlightSettingItem,
		mode: HighlightItemAddMode,
	) => {
		const newItem: HighlightSettingWithId = {
			id: crypto.randomUUID(),
			display: data.display,
			match: data.match,
			ignoreCase: data.ignoreCase,
			pattern: data.pattern,
		};
		if (mode === 'head') {
			insert(0, newItem);
		} else {
			append(newItem);
		}
	};

	const handleAddNewHighlightItem = (mode: HighlightItemAddMode) => {
		handleAddHighlightItem(
			{
				display: 'inline',
				match: 'contains',
				ignoreCase: true,
				pattern: '',
			},
			mode,
		);
	};

	return (
		<EditorGroup title={language['setting.editor.frontend.title']}>
			<Controller
				name="frontend.cssFontFamily"
				control={control}
				render={({ field, fieldState }) => (
					<EditorTextField
						{...field}
						label={language['setting.editor.frontend.cssFontFamily']}
						onReset={() => field.onChange(props.default.cssFontFamily)}
						fullWidth
						error={!!fieldState.error}
						helperText={<ErrorMessage fieldState={fieldState} />}
					/>
				)}
			/>

			<Controller
				name="frontend.cssFontSize"
				control={control}
				render={({ field, fieldState }) => (
					<EditorTextField
						{...field}
						label={language['setting.editor.frontend.cssFontSize']}
						onReset={() => field.onChange(props.default.cssFontSize)}
						error={!!fieldState.error}
						helperText={<ErrorMessage fieldState={fieldState} />}
					/>
				)}
			/>

			<Controller
				name="frontend.elementLimit"
				control={control}
				rules={{
					...ruleRequired(true, language),
					...ruleMin(1, language),
					...ruleMax(ValidationRules.intMax, language),
				}}
				render={({ field, fieldState }) => (
					<EditorNumberTextField
						{...field}
						label={language['setting.editor.frontend.elementLimit']}
						error={!!fieldState.error}
						helperText={<ErrorMessage fieldState={fieldState} />}
						onReset={() => field.onChange(props.default.elementLimit)}
					/>
				)}
			/>

			<EditorGroup title={language['setting.editor.frontend.highlight.title']}>
				<EditorGroup
					title={language['setting.editor.frontend.highlight.popup.title']}
				>
					<Controller
						name="highlight.popup.limit"
						control={control}
						rules={{
							...ruleRequired(true, language),
							...ruleMin(1, language),
							...ruleMax(100, language),
						}}
						render={({ field, fieldState }) => (
							<EditorNumberTextField
								{...field}
								label={
									language[
										'setting.editor.frontend.highlight.popup.limit.title'
									]
								}
								onReset={() =>
									field.onChange(DefaultHighlightPopupSetting.limit)
								}
								error={!!fieldState.error}
								helperText={<ErrorMessage fieldState={fieldState} />}
							/>
						)}
					/>

					<Controller
						name="highlight.popup.autoClose"
						control={control}
						render={({ field }) => (
							<FormControlLabel
								control={<EditorCheckbox {...field} checked={field.value} />}
								label={
									language[
										'setting.editor.frontend.highlight.popup.autoClose.title'
									]
								}
							/>
						)}
					/>

					<Controller
						name="highlight.popup.autoCloseDelay"
						control={control}
						rules={{
							...ruleRequired(true, language),
							...ruleMin(Environment.isDebug ? 1000 : 10 * 1000, language),
							...ruleMax(600 * 1000, language),
						}}
						render={({ field, fieldState }) => (
							<EditorNumberTextField
								{...field}
								label={
									language[
										'setting.editor.frontend.highlight.popup.autoCloseDelay.title'
									]
								}
								onReset={() =>
									field.onChange(DefaultHighlightPopupSetting.autoCloseDelay)
								}
								error={!!fieldState.error}
								helperText={<ErrorMessage fieldState={fieldState} />}
							/>
						)}
					/>
				</EditorGroup>

				<Button
					startIcon={<AddIcon />}
					onClick={() => handleAddNewHighlightItem('head')}
				>
					{language['setting.editor.frontend.highlight.addItem']}
				</Button>

				{watch('highlight.items').map((a, index) => (
					<EditorGroup key={a.id} title={`${index + 1}`}>
						<Controller
							name={`highlight.items.${index}.display`}
							control={control}
							render={({ field }) => (
								<EditorSelect
									{...field}
									label={
										language[
											'setting.editor.frontend.highlight.item.display.title'
										]
									}
									labelId="setting.editor.frontend.highlight.item.display.title"
								>
									{HighlightDisplaySchema.options.map((b) => (
										<MenuItem key={b} value={b}>
											{
												language[
													`setting.editor.frontend.highlight.item.display.enum.${b}`
												]
											}
										</MenuItem>
									))}
								</EditorSelect>
							)}
						/>

						<Controller
							name={`highlight.items.${index}.match`}
							control={control}
							render={({ field }) => (
								<EditorSelect
									{...field}
									label={
										language[
											'setting.editor.frontend.highlight.item.match.title'
										]
									}
									labelId="setting.editor.frontend.highlight.item.match.title"
								>
									{HighlightMatchSchema.options.map((b) => (
										<MenuItem key={b} value={b}>
											{
												language[
													`setting.editor.frontend.highlight.item.match.enum.${b}`
												]
											}
										</MenuItem>
									))}
								</EditorSelect>
							)}
						/>

						<Controller
							name={`highlight.items.${index}.pattern`}
							control={control}
							rules={{
								...ruleRequired(true, language),
								validate: (value) => {
									if (watch(`highlight.items.${index}.match`) === 'regex') {
										try {
											new RegExp(value);
										} catch (ex) {
											return format(language['validation.regex.format'], {
												VALUE: (ex as Error).message,
											});
										}
									}
								},
							}}
							render={({ field, fieldState }) => (
								<EditorTextField
									{...field}
									label={
										language[
											'setting.editor.frontend.highlight.item.pattern.title'
										]
									}
									error={!!fieldState.error}
									helperText={<ErrorMessage fieldState={fieldState} />}
								/>
							)}
						/>

						<Controller
							name={`highlight.items.${index}.ignoreCase`}
							control={control}
							render={({ field }) => (
								<FormControlLabel
									control={<EditorCheckbox {...field} checked={field.value} />}
									label={
										language[
											'setting.editor.frontend.highlight.item.ignoreCase.title'
										]
									}
								/>
							)}
						/>

						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<Box>
								<IconButton
									disabled={index === 0}
									onClick={() => move(index, index - 1)}
								>
									<ArrowUpwardIcon />
								</IconButton>
								<IconButton
									disabled={index === watch('highlight.items').length - 1}
									onClick={() => move(index, index + 1)}
								>
									<ArrowDownwardIcon />
								</IconButton>
							</Box>
							<Box>
								<IconButton color="warning" onClick={() => remove(index)}>
									<DeleteForeverIcon />
								</IconButton>
							</Box>
						</Box>
					</EditorGroup>
				))}

				{0 < watch('highlight.items').length && (
					<Button
						startIcon={<AddIcon />}
						onClick={() => handleAddNewHighlightItem('tail')}
					>
						{language['setting.editor.frontend.highlight.addItem']}
					</Button>
				)}

				<SettingDescription>
					{language['setting.editor.frontend.highlight.description']}
				</SettingDescription>
			</EditorGroup>
		</EditorGroup>
	);
};

export default FrontendGroup;
