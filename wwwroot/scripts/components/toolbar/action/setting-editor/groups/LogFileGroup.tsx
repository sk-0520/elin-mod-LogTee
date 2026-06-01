import { FormControlLabel } from '@mui/material';
import type { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useLanguageStore } from '../../../../../hooks/useLanguageStore';
import type { LogFileSetting } from '../../../../../types/csharp';
import { ruleRequired } from '../../../../../utils/forms';
import type { SettingFormData } from '../EditorContainer';
import { EditorCheckbox, EditorTextField } from '../EditorControls';
import EditorGroup from '../EditorGroup';
import ErrorMessage from '../ErrorMessage';
import SettingDescription from '../SettingDescription';

export interface LogFileGroupProps {
	default: LogFileSetting;
}

const LogFileGroup: FC<LogFileGroupProps> = (_props) => {
	const language = useLanguageStore((a) => a.language);
	const { control, watch } = useFormContext<SettingFormData>();

	return (
		<EditorGroup title={language['setting.editor.logFile.title']}>
			<Controller
				name="logFile.isEnabled"
				control={control}
				render={({ field }) => (
					<FormControlLabel
						control={<EditorCheckbox {...field} checked={field.value} />}
						label={language['setting.editor.logFile.isEnabled']}
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
					<EditorTextField
						{...field}
						label={language['setting.editor.logFile.filePath']}
						error={!!fieldState.error}
						helperText={<ErrorMessage fieldState={fieldState} />}
					/>
				)}
			/>

			<SettingDescription>
				{language['setting.editor.logFile.description']}
			</SettingDescription>
		</EditorGroup>
	);
};

export default LogFileGroup;
