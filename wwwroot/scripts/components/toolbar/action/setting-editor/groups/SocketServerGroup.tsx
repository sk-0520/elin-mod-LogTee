import { FormControlLabel } from '@mui/material';
import type { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useLanguageStore } from '../../../../../hooks/useLanguageStore';
import type { SocketServerSetting } from '../../../../../types/csharp';
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

export interface SocketServerGroupProps {
	default: SocketServerSetting;
}

const SocketServerGroup: FC<SocketServerGroupProps> = (props) => {
	const language = useLanguageStore((a) => a.language);
	const { control, watch } = useFormContext<SettingFormData>();

	return (
		<EditorGroup title={language['setting.editor.socketServer.title']}>
			<Controller
				name="socketServer.isEnabled"
				control={control}
				render={({ field }) => (
					<FormControlLabel
						control={<EditorCheckbox {...field} checked={field.value} />}
						label={language['setting.editor.socketServer.isEnabled']}
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
					<EditorNumberTextField
						{...field}
						label={language['setting.editor.socketServer.port']}
						onReset={() => field.onChange(props.default.port)}
						error={!!fieldState.error}
						helperText={<ErrorMessage fieldState={fieldState} />}
					/>
				)}
			/>

			<SettingDescription>
				{language['setting.editor.socketServer.description']}
			</SettingDescription>
		</EditorGroup>
	);
};

export default SocketServerGroup;
