import type { FC } from 'react';
import type { ControllerFieldState } from 'react-hook-form';

export interface ErrorMessageProps {
	fieldState: ControllerFieldState;
}

const ErrorMessage: FC<ErrorMessageProps> = (props) => {
	const { fieldState } = props;
	return fieldState?.error?.message;
};

export default ErrorMessage;
