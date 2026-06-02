import {
	Box,
	Button,
	Container,
	createTheme,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	ThemeProvider,
	Typography,
} from '@mui/material';
import { encode } from 'js-base64';
import type { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import postSetting from '../../../../api/postSetting';
import { useErrorNotifyStore } from '../../../../hooks/useErrorNotifyStore';
import { useLanguageStore } from '../../../../hooks/useLanguageStore';
import type { Setting } from '../../../../types/csharp';
import {
	type HighlightPopupSetting,
	HighlightPopupSettingSchema,
	type HighlightSetting,
	type HighlightSettingWithId,
} from '../../../../types/highlight';
import { parseHighlightSetting } from '../../../../utils/setting';
import FrontendGroup from './groups/FrontendGroup';
import LogBufferGroup from './groups/LogBufferGroup';
import LogFileGroup from './groups/LogFileGroup';
import SocketClientGroup from './groups/SocketClientGroup';
import SocketServerGroup from './groups/SocketServerGroup';
import WebServerGroup from './groups/WebServerGroup';
import ResetButton from './ResetButton';

export type SettingFormData = Setting & {
	highlight: {
		popup: HighlightPopupSetting;
		items: HighlightSettingWithId[];
	};
};

const DefaultHighlightPopupSetting =
	HighlightPopupSettingSchema.parse(undefined);

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
		popup: DefaultHighlightPopupSetting,
		items: [],
	};
}

export interface EditorContainerProps {
	setting: Setting;
	default: Setting;
	onCancel: () => void;
}

const Theme = createTheme({
	typography: {
		button: {
			textTransform: 'none',
		},
	},
	components: {
		MuiButton: {
			defaultProps: {
				variant: 'outlined',
			},
		},
	},
});

const EditorContainer: FC<EditorContainerProps> = (props) => {
	const { setting, onCancel } = props;
	const language = useLanguageStore((a) => a.language);
	const setError = useErrorNotifyStore((a) => a.setError);
	const { control, watch, handleSubmit, ...rfh } = useForm<SettingFormData>({
		defaultValues: {
			...setting,
			highlight: parseParsedHighlightSetting(setting.frontend.highlightV2),
		},
	});

	const onSubmit = async (data: SettingFormData) => {
		try {
			const { highlight, ...apiData } = data;
			apiData.frontend.highlightV2 = encode(
				JSON.stringify({
					popup: highlight.popup,
					items: highlight.items.map((a) => ({
						display: a.display,
						match: a.match,
						ignoreCase: a.ignoreCase,
						pattern: a.pattern,
					})),
				} satisfies HighlightSetting),
			);
			await postSetting(apiData);
			// 全部初期化すべし
			// 細かい状態管理をしていないのでこれでよろし
			location.reload();
		} catch (error) {
			setError(error);
		}
	};

	return (
		<ThemeProvider theme={Theme}>
			<FormProvider {...{ control, watch, handleSubmit, ...rfh }}>
				<DialogTitle>{language['setting.editor.title']}</DialogTitle>
				<DialogContent>
					<Typography align="center" color="warning">
						{language['setting.apply.warning']}
					</Typography>
					<FormControl fullWidth>
						<Box>
							<Container>
								<LogBufferGroup default={props.default.logBuffer} />

								<LogFileGroup default={props.default.logFile} />

								<SocketClientGroup default={props.default.socketClient} />

								<SocketServerGroup default={props.default.socketServer} />

								<WebServerGroup default={props.default.webServer} />

								<FrontendGroup default={props.default.frontend} />

								{/* <pre>{JSON.stringify(setting, null, 2)}</pre> */}
							</Container>
						</Box>
					</FormControl>
				</DialogContent>
				<DialogActions
					sx={{ display: 'flex', justifyContent: 'space-between' }}
				>
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
							{language['setting.editor.save']}
						</Button>

						<Button
							variant="contained"
							color="secondary"
							sx={{ flex: 1 }}
							onClick={onCancel}
						>
							{language['setting.editor.cancel']}
						</Button>
					</Box>
				</DialogActions>
			</FormProvider>
		</ThemeProvider>
	);
};

export default EditorContainer;
