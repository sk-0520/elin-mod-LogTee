import { FormControlLabel } from '@mui/material';
import type { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useLanguageStore } from '../../../../../hooks/useLanguageStore';
import type { WebServerSetting } from '../../../../../types/csharp';
import {
	ruleMax,
	ruleMin,
	ruleRequired,
	ValidationRules,
} from '../../../../../utils/forms';
import type { SettingFormData } from '../EditorContainer';
import { EditorCheckbox, EditorNumberTextField } from '../EditorControls';
import EditorGroup from '../EditorGroup';
import ErrorMessage from '../ErrorMessage';
import SettingDescription from '../SettingDescription';

export interface WebServerGroupProps {
	default: WebServerSetting;
}

const WebServerGroup: FC<WebServerGroupProps> = (props) => {
	const language = useLanguageStore((a) => a.language);
	const { control, watch } = useFormContext<SettingFormData>();

	return (
		<EditorGroup title={language['setting.editor.webServer.title']}>
			<Controller
				name="webServer.isEnabled"
				control={control}
				render={({ field }) => (
					<FormControlLabel
						control={<EditorCheckbox {...field} checked={field.value} />}
						label={language['setting.editor.webServer.isEnabled']}
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
					<EditorNumberTextField
						{...field}
						label={language['setting.editor.webServer.port']}
						onReset={() => field.onChange(props.default.port)}
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
						control={<EditorCheckbox {...field} checked={field.value} />}
						label={language['setting.editor.webServer.openBrowserOnStartup']}
					/>
				)}
			/>

			<SettingDescription>
				{language['setting.editor.webServer.description']}
			</SettingDescription>
		</EditorGroup>
	);
};

export default WebServerGroup;
