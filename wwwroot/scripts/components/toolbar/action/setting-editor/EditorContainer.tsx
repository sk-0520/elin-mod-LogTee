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
	TextField,
	type TextFieldProps,
	Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import postSetting from '../../../../api/postSetting';
import { useErrorNotifyStore } from '../../../../stores/useErrorNotifyStore';
import { useLanguageStore } from '../../../../stores/useLanguageStore';
import type { Setting } from '../../../../types/csharp';
import EditorGroup from './EditorGroup';
import ResetButton from './ResetButton';
import SettingDescription from './SettingDescription';

const StyledTextField = styled((props: TextFieldProps) => (
	<TextField size="small" {...props} />
))((_) => ({}));

const StyledNumberTextField = styled((props: TextFieldProps) => (
	<StyledTextField type="number" {...props} />
))((_) => ({
	input: {
		textAlign: 'right',
	},
}));

const StyledCheckbox = styled((props: CheckboxProps) => (
	<Checkbox size="small" {...props} />
))((_) => ({
	padding: '4px',
}));

export interface EditorContainerProps {
	setting: Setting;
	onCancel: () => void;
}

const EditorContainer: FC<EditorContainerProps> = (props) => {
	const { setting, onCancel } = props;
	const getText = useLanguageStore((a) => a.getText);
	const setError = useErrorNotifyStore((a) => a.setError);
	const { control, handleSubmit } = useForm<Setting>({
		defaultValues: setting,
	});

	const onSubmit = async (data: Setting) => {
		console.log(data);
		try {
			await postSetting(data);
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
									render={({ field }) => (
										<StyledNumberTextField
											label={getText('setting.editor.logBuffer.capacity')}
											{...field}
										/>
									)}
								/>

								<Controller
									name="logBuffer.logFlushLimit"
									control={control}
									render={({ field }) => (
										<StyledNumberTextField
											label={getText('setting.editor.logBuffer.logFlushLimit')}
											{...field}
										/>
									)}
								/>

								<Controller
									name="logBuffer.logFlushInterval"
									control={control}
									render={({ field }) => (
										<StyledNumberTextField
											label={getText(
												'setting.editor.logBuffer.logFlushInterval',
											)}
											{...field}
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
												<StyledCheckbox checked={field.value} {...field} />
											}
											label={getText('setting.editor.logFile.isEnabled')}
										/>
									)}
								/>

								<Controller
									name="logFile.filePath"
									control={control}
									render={({ field }) => (
										<StyledTextField
											label={getText('setting.editor.logFile.filePath')}
											{...field}
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
												<StyledCheckbox checked={field.value} {...field} />
											}
											label={getText('setting.editor.socketClient.isEnabled')}
										/>
									)}
								/>

								<Controller
									name="socketClient.hostName"
									control={control}
									render={({ field }) => (
										<StyledTextField
											label={getText('setting.editor.socketClient.hostName')}
											{...field}
										/>
									)}
								/>

								<Controller
									name="socketClient.port"
									control={control}
									render={({ field }) => (
										<StyledNumberTextField
											label={getText('setting.editor.socketClient.port')}
											{...field}
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
												<StyledCheckbox checked={field.value} {...field} />
											}
											label={getText('setting.editor.socketServer.isEnabled')}
										/>
									)}
								/>
								<Controller
									name="socketServer.port"
									control={control}
									render={({ field }) => (
										<StyledNumberTextField
											label={getText('setting.editor.socketServer.port')}
											{...field}
										/>
									)}
								/>

								<Controller
									name="socketServer.capacity"
									control={control}
									render={({ field }) => (
										<StyledNumberTextField
											label={getText('setting.editor.socketServer.capacity')}
											{...field}
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
												<StyledCheckbox checked={field.value} {...field} />
											}
											label={getText('setting.editor.webServer.isEnabled')}
										/>
									)}
								/>
								<Controller
									name="webServer.port"
									control={control}
									render={({ field }) => (
										<StyledNumberTextField
											label={getText('setting.editor.webServer.port')}
											{...field}
										/>
									)}
								/>

								<Controller
									name="webServer.openBrowserOnStartup"
									control={control}
									render={({ field }) => (
										<FormControlLabel
											control={
												<StyledCheckbox checked={field.value} {...field} />
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
									render={({ field }) => (
										<StyledTextField
											label={getText('setting.editor.frontend.cssFontFamily')}
											fullWidth
											{...field}
										/>
									)}
								/>

								<Controller
									name="frontend.cssFontSize"
									control={control}
									render={({ field }) => (
										<StyledTextField
											label={getText('setting.editor.frontend.cssFontSize')}
											{...field}
										/>
									)}
								/>

								<Controller
									name="frontend.elementLimit"
									control={control}
									render={({ field }) => (
										<StyledNumberTextField
											label={getText('setting.editor.frontend.elementLimit')}
											{...field}
										/>
									)}
								/>

								<SettingDescription>
									{getText('setting.editor.frontend.description')}
								</SettingDescription>
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
