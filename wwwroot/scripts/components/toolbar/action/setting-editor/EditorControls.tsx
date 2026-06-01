import {
	Checkbox,
	type CheckboxProps,
	FormControl,
	InputLabel,
	Select,
	type SelectProps,
} from '@mui/material';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import type { FC } from 'react';
import ResetIcon, { type ResetIconProps } from './ResetIcon';

export type EditorTextFieldProps = TextFieldProps & ResetIconProps;

export const EditorTextField: FC<EditorTextFieldProps> = (
	props: EditorTextFieldProps,
) => {
	const { onReset, resetPosition, ...originProps } = props;

	return (
		<TextField
			{...originProps}
			slotProps={
				onReset
					? {
							input: {
								startAdornment:
									resetPosition === 'start' ? (
										<ResetIcon
											onReset={onReset}
											resetPosition={resetPosition}
										/>
									) : undefined,
								endAdornment:
									resetPosition === 'end' || resetPosition === undefined ? (
										<ResetIcon
											onReset={onReset}
											resetPosition={resetPosition}
										/>
									) : undefined,
							},
						}
					: undefined
			}
			size="small"
		/>
	);
};

export interface ControllerRenderProps {
	onChange: (...event: unknown[]) => void;
	onBlur: () => void;
}

export type EditorNumberTextFieldProps = TextFieldProps &
	ControllerRenderProps &
	ResetIconProps;

export const EditorNumberTextField: FC<EditorNumberTextFieldProps> = (
	props: EditorNumberTextFieldProps,
) => {
	const { resetPosition, ...originProps } = props;
	return (
		<EditorTextField
			{...originProps}
			sx={{ input: { textAlign: 'right' } }}
			type="number"
			resetPosition={resetPosition ?? 'start'}
			onChange={(e) => {
				const v = e.target.value;
				const v2 = Number(v);
				props.onChange(v2);
			}}
		/>
	);
};

export const EditorSelect: FC<SelectProps> = (props: SelectProps) => (
	<FormControl>
		<InputLabel id={props.labelId}>{props.label}</InputLabel>
		<Select {...props} size="small" />
	</FormControl>
);

export const EditorCheckbox: FC<CheckboxProps> = (props: CheckboxProps) => {
	const { sx, ...originProps } = props;
	return (
		<Checkbox {...originProps} sx={{ padding: '4px', ...sx }} size="small" />
	);
};
