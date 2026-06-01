import { FormControlLabel } from '@mui/material';
import type { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useLanguageStore } from '../../../../../hooks/useLanguageStore';
import type { SocketClientSetting } from '../../../../../types/csharp';
import {
	ruleMax,
	ruleMin,
	ruleRequired,
	ValidationRules,
} from '../../../../../utils/forms';
import type { SettingFormData } from '../EditorContainer';
import {
	EditorCheckbox,
	EditorNumberTextField,
	EditorTextField,
} from '../EditorControls';
import EditorGroup from '../EditorGroup';
import ErrorMessage from '../ErrorMessage';
import SettingDescription from '../SettingDescription';

export interface SocketClientGroupProps {
	default: SocketClientSetting;
}

const SocketClientGroup: FC<SocketClientGroupProps> = (props) => {
	const language = useLanguageStore((a) => a.language);
	const { control, watch } = useFormContext<SettingFormData>();

	return (
		<EditorGroup title={language['setting.editor.socketClient.title']}>
			<Controller
				name="socketClient.isEnabled"
				control={control}
				render={({ field }) => (
					<FormControlLabel
						control={<EditorCheckbox {...field} checked={field.value} />}
						label={language['setting.editor.socketClient.isEnabled']}
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
					<EditorTextField
						{...field}
						label={language['setting.editor.socketClient.hostName']}
						onReset={() => field.onChange(props.default.hostName)}
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
					<EditorNumberTextField
						{...field}
						label={language['setting.editor.socketClient.port']}
						onReset={() => field.onChange(props.default.port)}
						error={!!fieldState.error}
						helperText={<ErrorMessage fieldState={fieldState} />}
					/>
				)}
			/>

			<SettingDescription>
				{language['setting.editor.socketClient.description']}
			</SettingDescription>
		</EditorGroup>
	);
};

export default SocketClientGroup;
