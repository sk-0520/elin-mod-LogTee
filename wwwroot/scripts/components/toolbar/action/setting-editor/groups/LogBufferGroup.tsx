import type { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useLanguageStore } from '../../../../../hooks/useLanguageStore';
import type { LogBufferSetting } from '../../../../../types/csharp';
import {
	ruleMax,
	ruleMin,
	ruleRequired,
	ValidationRules,
} from '../../../../../utils/forms';
import type { SettingFormData } from '../EditorContainer';
import { EditorNumberTextField } from '../EditorControls';
import EditorGroup from '../EditorGroup';
import ErrorMessage from '../ErrorMessage';
import SettingDescription from '../SettingDescription';

export interface LogBufferGroupProps {
	default: LogBufferSetting;
}

const LogBufferGroup: FC<LogBufferGroupProps> = (props) => {
	const language = useLanguageStore((a) => a.language);
	const { control, watch } = useFormContext<SettingFormData>();

	return (
		<EditorGroup title={language['setting.editor.logBuffer.title']}>
			<Controller
				name="logBuffer.capacity"
				control={control}
				rules={{
					...ruleRequired(true, language),
					...ruleMin(1, language),
					...ruleMax(ValidationRules.intMax, language),
				}}
				render={({ field, fieldState }) => (
					<EditorNumberTextField
						{...field}
						label={language['setting.editor.logBuffer.capacity']}
						onReset={() => field.onChange(props.default.capacity)}
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
					...ruleMin(1, language),
					...ruleMax(ValidationRules.intMax, language),
				}}
				render={({ field, fieldState }) => (
					<EditorNumberTextField
						{...field}
						label={language['setting.editor.logBuffer.logFlushLimit']}
						onReset={() => field.onChange(props.default.logFlushLimit)}
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
					...ruleMin(Math.max(watch('logBuffer.capacity'), 1), language),
					...ruleMax(ValidationRules.intMax, language),
				}}
				render={({ field, fieldState }) => (
					<EditorNumberTextField
						{...field}
						label={language['setting.editor.logBuffer.logFlushInterval']}
						onReset={() => field.onChange(props.default.logFlushInterval)}
						error={!!fieldState.error}
						helperText={<ErrorMessage fieldState={fieldState} />}
					/>
				)}
			/>

			<SettingDescription>
				{language['setting.editor.logBuffer.description']}
			</SettingDescription>
		</EditorGroup>
	);
};

export default LogBufferGroup;
