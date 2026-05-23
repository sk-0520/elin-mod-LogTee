import {
	type Setting,
	type SettingRequest,
	SimpleResultResponseScheme,
} from '../types/csharp';
import { joinEndpoint, throwIfNotOk } from '../utils/api';

export default async function postSetting(setting: Setting): Promise<void> {
	const request: SettingRequest = {
		setting: setting,
	};
	const response = await fetch(joinEndpoint('/api/setting'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(request),
	});

	throwIfNotOk(response);

	const json = await response.json();
	const result = SimpleResultResponseScheme.parse(json);
	if (!result.success) {
		throw new Error(
			`Failed to reset setting. Details: ${JSON.stringify(result.details)}`,
		);
	}
}
