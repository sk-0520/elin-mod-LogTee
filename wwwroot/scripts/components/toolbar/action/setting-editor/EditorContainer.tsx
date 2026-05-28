import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
	Box,
	Button,
	Checkbox,
	type CheckboxProps,
	Container,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormControlLabel,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	type SelectProps,
	TextField,
	type TextFieldProps,
	Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { FC } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import postSetting from '../../../../api/postSetting';
import { useErrorNotifyStore } from '../../../../hooks/useErrorNotifyStore';
import { useLanguageStore } from '../../../../hooks/useLanguageStore';
import type { Setting } from '../../../../types/csharp';
import {
	HighlightDisplaySchema,
	HighlightMatchSchema,
	type HighlightPopupSetting,
	HighlightPopupSettingSchema,
	type HighlightSetting,
	type HighlightSettingItem,
	type HighlightSettingWithId,
} from '../../../../types/highlight';
import {
	ruleMax,
	ruleMin,
	rulesRequired as ruleRequired,
} from '../../../../utils/forms';
import { format } from '../../../../utils/language';
import { parseHighlightSetting } from '../../../../utils/setting';
import EditorGroup from './EditorGroup';
import ErrorMessage from './ErrorMessage';
import ResetButton from './ResetButton';
import SettingDescription from './SettingDescription';

const StyledTextField = styled((props: TextFieldProps) => (
	<TextField {...props} size="small" />
))((_) => ({}));

interface ControllerRenderProps {
	onChange: (...event: unknown[]) => void;
	onBlur: () => void;
}

const StyledNumberTextField = styled(
	(props: TextFieldProps & ControllerRenderProps) => (
		<StyledTextField
			{...props}
			type="number"
			onChange={(e) => {
				const v = e.target.value;
				const v2 = Number(v);
				props.onChange(v2);
			}}
		/>
	),
)((_) => ({
	input: {
		textAlign: 'right',
	},
}));

const StyledSelect = styled((props: SelectProps) => (
	<FormControl>
		<InputLabel id={props.labelId}>{props.label}</InputLabel>
		<Select {...props} size="small" />
	</FormControl>
))((_) => ({}));

const StyledCheckbox = styled((props: CheckboxProps) => (
	<Checkbox {...props} size="small" />
))((_) => ({
	padding: '4px',
}));

type SettingFormData = Setting & {
	highlight: {
		popup: HighlightPopupSetting;
		items: HighlightSettingWithId[];
	};
};

type HighlightItemAddMode = 'head' | 'tail';

const ValidationRules = {
	intMax: 2147483647,
	portMin: 0,
	portMax: 65535,
} as const;

function parseParsedHighlightSetting(
	rawHighlight: string,
): SettingFormData['highlight'] {
	if (rawHighlight) {
		const parsed = parseHighlightSetting(rawHighlight);

		return {
			popup: parsed.popup,
			items: parsed.items.map((a) => ({
				id: crypto.randomUUID(),
				display: a.display,
				match: a.match,
				ignoreCase: a.ignoreCase,
				pattern: a.match === 'regex' ? a.regex.source : a.text,
			})),
		};
	}

	return {
		popup: HighlightPopupSettingSchema.parse(undefined),
		items: [],
	};
}

export interface EditorContainerProps {
	setting: Setting;
	onCancel: () => void;
}

const EditorContainer: FC<EditorContainerProps> = (props) => {
	const { setting, onCancel } = props;
	const language = useLanguageStore((a) => a.language);
	const getText = useLanguageStore((a) => a.getText);
	const setError = useErrorNotifyStore((a) => a.setError);
	const { control, watch, handleSubmit } = useForm<SettingFormData>({
		defaultValues: {
			...setting,
			highlight: parseParsedHighlightSetting(setting.frontend.highlight),
		},
	});

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

	const onSubmit = async (data: SettingFormData) => {
		try {
			const { highlight, ...apiData } = data;
			apiData.frontend.highlight = JSON.stringify({
				popup: highlight.popup,
				items: highlight.items.map((a) => ({
					display: a.display,
					match: a.match,
					ignoreCase: a.ignoreCase,
					pattern: a.pattern,
				})),
			} satisfies HighlightSetting);
			await postSetting(apiData);
			// 全部初期化すべし
			// 細かい状態管理をしていないのでこれでよろし
			location.reload();
		} catch (error) {
			setError(error);
		}
	};

	return (
		<>
			<DialogTitle>{getText('setting.editor.title')}</DialogTitle>
			<DialogContent>
				<Typography align="center" color="warning">
					{getText('setting.apply.warning')}
				</Typography>
				<FormControl fullWidth>
					<Box>
						<Container>
							<EditorGroup title={getText('setting.editor.logBuffer.title')}>
								<Controller
									name="logBuffer.capacity"
									control={control}
									rules={{
										...ruleRequired(true, language),
										...ruleMin(1, language),
										...ruleMax(ValidationRules.intMax, language),
									}}
									render={({ field, fieldState }) => (
										<StyledNumberTextField
											{...field}
											label={getText('setting.editor.logBuffer.capacity')}
											error={!!fieldState.error}
											helperText={<ErrorMessage fieldState={fieldState} />}
										/>
									)}
								/>

								<Controller
									name="logBuffer.logFlushLimit"
									control={control}
									rules={{
										...ruleRequired(true, language),
										...ruleMin(
											Math.max(watch('logBuffer.capacity'), 1),
											language,
										),
										...ruleMax(ValidationRules.intMax, language),
									}}
									render={({ field, fieldState }) => (
										<StyledNumberTextField
											{...field}
											label={getText('setting.editor.logBuffer.logFlushLimit')}
											error={!!fieldState.error}
											helperText={<ErrorMessage fieldState={fieldState} />}
										/>
									)}
								/>

								<Controller
									name="logBuffer.logFlushInterval"
									control={control}
									rules={{
										...ruleRequired(true, language),
										...ruleMin(
											Math.max(watch('logBuffer.capacity'), 1),
											language,
										),
										...ruleMax(ValidationRules.intMax, language),
									}}
									render={({ field, fieldState }) => (
										<StyledNumberTextField
											{...field}
											label={getText(
												'setting.editor.logBuffer.logFlushInterval',
											)}
											error={!!fieldState.error}
											helperText={<ErrorMessage fieldState={fieldState} />}
										/>
									)}
								/>

								<SettingDescription>
									{getText('setting.editor.logBuffer.description')}
								</SettingDescription>
							</EditorGroup>

							<EditorGroup title={getText('setting.editor.logFile.title')}>
								<Controller
									name="logFile.isEnabled"
									control={control}
									render={({ field }) => (
										<FormControlLabel
											control={
												<StyledCheckbox {...field} checked={field.value} />
											}
											label={getText('setting.editor.logFile.isEnabled')}
										/>
									)}
								/>

								<Controller
									name="logFile.filePath"
									control={control}
									rules={{
										...ruleRequired(watch('logFile.isEnabled'), language),
									}}
									render={({ field, fieldState }) => (
										<StyledTextField
											{...field}
											label={getText('setting.editor.logFile.filePath')}
											error={!!fieldState.error}
											helperText={<ErrorMessage fieldState={fieldState} />}
										/>
									)}
								/>

								<SettingDescription>
									{getText('setting.editor.logFile.description')}
								</SettingDescription>
							</EditorGroup>

							<EditorGroup title={getText('setting.editor.socketClient.title')}>
								<Controller
									name="socketClient.isEnabled"
									control={control}
									render={({ field }) => (
										<FormControlLabel
											control={
												<StyledCheckbox {...field} checked={field.value} />
											}
											label={getText('setting.editor.socketClient.isEnabled')}
										/>
									)}
								/>

								<Controller
									name="socketClient.hostName"
									control={control}
									rules={{
										...ruleRequired(watch('socketClient.isEnabled'), language),
									}}
									render={({ field, fieldState }) => (
										<StyledTextField
											{...field}
											label={getText('setting.editor.socketClient.hostName')}
											error={!!fieldState.error}
											helperText={<ErrorMessage fieldState={fieldState} />}
										/>
									)}
								/>

								<Controller
									name="socketClient.port"
									control={control}
									rules={{
										...ruleRequired(watch('socketClient.isEnabled'), language),
										...ruleMin(ValidationRules.portMin, language),
										...ruleMax(ValidationRules.portMax, language),
									}}
									render={({ field, fieldState }) => (
										<StyledNumberTextField
											{...field}
											label={getText('setting.editor.socketClient.port')}
											error={!!fieldState.error}
											helperText={<ErrorMessage fieldState={fieldState} />}
										/>
									)}
								/>

								<SettingDescription>
									{getText('setting.editor.socketClient.description')}
								</SettingDescription>
							</EditorGroup>

							<EditorGroup title={getText('setting.editor.socketServer.title')}>
								<Controller
									name="socketServer.isEnabled"
									control={control}
									render={({ field }) => (
										<FormControlLabel
											control={
												<StyledCheckbox {...field} checked={field.value} />
											}
											label={getText('setting.editor.socketServer.isEnabled')}
										/>
									)}
								/>
								<Controller
									name="socketServer.port"
									control={control}
									rules={{
										...ruleRequired(watch('socketServer.isEnabled'), language),
										...ruleMin(ValidationRules.portMin, language),
										...ruleMax(ValidationRules.portMax, language),
									}}
									render={({ field, fieldState }) => (
										<StyledNumberTextField
											{...field}
											label={getText('setting.editor.socketServer.port')}
											error={!!fieldState.error}
											helperText={<ErrorMessage fieldState={fieldState} />}
										/>
									)}
								/>

								<Controller
									name="socketServer.capacity"
									control={control}
									rules={{
										...ruleRequired(watch('socketServer.isEnabled'), language),
										...ruleMin(1, language),
										...ruleMax(ValidationRules.intMax, language),
									}}
									render={({ field, fieldState }) => (
										<StyledNumberTextField
											{...field}
											label={getText('setting.editor.socketServer.capacity')}
											error={!!fieldState.error}
											helperText={<ErrorMessage fieldState={fieldState} />}
										/>
									)}
								/>

								<SettingDescription>
									{getText('setting.editor.socketServer.description')}
								</SettingDescription>
							</EditorGroup>

							<EditorGroup title={getText('setting.editor.webServer.title')}>
								<Controller
									name="webServer.isEnabled"
									control={control}
									render={({ field }) => (
										<FormControlLabel
											control={
												<StyledCheckbox {...field} checked={field.value} />
											}
											label={getText('setting.editor.webServer.isEnabled')}
										/>
									)}
								/>
								<Controller
									name="webServer.port"
									control={control}
									rules={{
										...ruleRequired(watch('webServer.isEnabled'), language),
										...ruleMin(ValidationRules.portMin, language),
										...ruleMax(ValidationRules.portMax, language),
									}}
									render={({ field, fieldState }) => (
										<StyledNumberTextField
											{...field}
											label={getText('setting.editor.webServer.port')}
											error={!!fieldState.error}
											helperText={<ErrorMessage fieldState={fieldState} />}
										/>
									)}
								/>

								<Controller
									name="webServer.openBrowserOnStartup"
									control={control}
									render={({ field }) => (
										<FormControlLabel
											control={
												<StyledCheckbox {...field} checked={field.value} />
											}
											label={getText(
												'setting.editor.webServer.openBrowserOnStartup',
											)}
										/>
									)}
								/>

								<SettingDescription>
									{getText('setting.editor.webServer.description')}
								</SettingDescription>
							</EditorGroup>
							<EditorGroup title={getText('setting.editor.frontend.title')}>
								<Controller
									name="frontend.cssFontFamily"
									control={control}
									render={({ field, fieldState }) => (
										<StyledTextField
											{...field}
											label={getText('setting.editor.frontend.cssFontFamily')}
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
										<StyledTextField
											{...field}
											label={getText('setting.editor.frontend.cssFontSize')}
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
										<StyledNumberTextField
											{...field}
											label={getText('setting.editor.frontend.elementLimit')}
											error={!!fieldState.error}
											helperText={<ErrorMessage fieldState={fieldState} />}
										/>
									)}
								/>

								<EditorGroup
									title={getText('setting.editor.frontend.highlight.title')}
								>
									<EditorGroup
										title={getText(
											'setting.editor.frontend.highlight.popup.title',
										)}
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
												<StyledNumberTextField
													{...field}
													label={getText(
														'setting.editor.frontend.highlight.popup.limit.title',
													)}
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
													control={
														<StyledCheckbox {...field} checked={field.value} />
													}
													label={getText(
														'setting.editor.frontend.highlight.popup.autoClose.title',
													)}
												/>
											)}
										/>

										<Controller
											name="highlight.popup.autoCloseDelay"
											control={control}
											rules={{
												...ruleRequired(true, language),
												...ruleMin(10 * 1000, language),
												...ruleMax(300 * 1000, language),
											}}
											render={({ field, fieldState }) => (
												<StyledNumberTextField
													{...field}
													label={getText(
														'setting.editor.frontend.highlight.popup.autoCloseDelay.title',
													)}
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
										{getText('setting.editor.frontend.highlight.addItem')}
									</Button>

									{watch('highlight.items').map((a, index) => (
										<EditorGroup key={a.id} title={`${index + 1}`}>
											<Controller
												name={`highlight.items.${index}.display`}
												control={control}
												render={({ field }) => (
													<StyledSelect
														{...field}
														label={getText(
															'setting.editor.frontend.highlight.item.display.title',
														)}
														labelId="setting.editor.frontend.highlight.item.display.title"
													>
														{HighlightDisplaySchema.options.map((b) => (
															<MenuItem key={b} value={b}>
																{getText(
																	`setting.editor.frontend.highlight.item.display.enum.${b}`,
																)}
															</MenuItem>
														))}
													</StyledSelect>
												)}
											/>

											<Controller
												name={`highlight.items.${index}.match`}
												control={control}
												render={({ field }) => (
													<StyledSelect
														{...field}
														label={getText(
															'setting.editor.frontend.highlight.item.match.title',
														)}
														labelId="setting.editor.frontend.highlight.item.match.title"
													>
														{HighlightMatchSchema.options.map((b) => (
															<MenuItem key={b} value={b}>
																{getText(
																	`setting.editor.frontend.highlight.item.match.enum.${b}`,
																)}
															</MenuItem>
														))}
													</StyledSelect>
												)}
											/>

											<Controller
												name={`highlight.items.${index}.pattern`}
												control={control}
												rules={{
													...ruleRequired(true, language),
													validate: (value) => {
														if (
															watch(`highlight.items.${index}.match`) ===
															'regex'
														) {
															try {
																new RegExp(value);
															} catch (ex) {
																return format(
																	getText('validation.regex.format'),
																	{ VALUE: (ex as Error).message },
																);
															}
														}
													},
												}}
												render={({ field, fieldState }) => (
													<StyledTextField
														{...field}
														label={getText(
															'setting.editor.frontend.highlight.item.pattern.title',
														)}
														error={!!fieldState.error}
														helperText={
															<ErrorMessage fieldState={fieldState} />
														}
													/>
												)}
											/>

											<Controller
												name={`highlight.items.${index}.ignoreCase`}
												control={control}
												render={({ field }) => (
													<FormControlLabel
														control={
															<StyledCheckbox
																{...field}
																checked={field.value}
															/>
														}
														label={getText(
															'setting.editor.frontend.highlight.item.ignoreCase.title',
														)}
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
														disabled={
															index === watch('highlight.items').length - 1
														}
														onClick={() => move(index, index + 1)}
													>
														<ArrowDownwardIcon />
													</IconButton>
												</Box>
												<Box>
													<IconButton
														color="warning"
														onClick={() => remove(index)}
													>
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
											{getText('setting.editor.frontend.highlight.addItem')}
										</Button>
									)}

									<SettingDescription>
										{getText('setting.editor.frontend.highlight.description')}
									</SettingDescription>
								</EditorGroup>
							</EditorGroup>
							{/* <pre>{JSON.stringify(setting, null, 2)}</pre> */}
						</Container>
					</Box>
				</FormControl>
			</DialogContent>
			<DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<Box sx={{ display: 'flex' }}>
					<ResetButton />
				</Box>

				<Box sx={{ display: 'flex', width: '50%' }}>
					<Button
						variant="contained"
						color="primary"
						sx={{ flex: 1, marginRight: '1em' }}
						onClick={handleSubmit(onSubmit)}
					>
						{getText('setting.editor.save')}
					</Button>

					<Button
						variant="contained"
						color="secondary"
						sx={{ flex: 1 }}
						onClick={onCancel}
					>
						{getText('setting.editor.cancel')}
					</Button>
				</Box>
			</DialogActions>
		</>
	);
};

export default EditorContainer;
