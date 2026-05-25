import type { ValidationValueMessage } from 'react-hook-form';
import { format, type Language } from './language';

export function rulesRequired(
	boolean: boolean,
	language: Language,
): { required: string | false } {
	return { required: boolean ? language['validation.required'] : false };
}

export function ruleMin<TValidationValue extends number>(
	value: TValidationValue,
	language: Language,
): { min: ValidationValueMessage<TValidationValue> | undefined } {
	return {
		min: {
			value: value,
			message: format(language['validation.min.format'], { VALUE: value }),
		},
	};
}

export function ruleMax<TValidationValue extends number>(
	value: TValidationValue,
	language: Language,
): { max: ValidationValueMessage<TValidationValue> | undefined } {
	return {
		max: {
			value: value,
			message: format(language['validation.max.format'], { VALUE: value }),
		},
	};
}
