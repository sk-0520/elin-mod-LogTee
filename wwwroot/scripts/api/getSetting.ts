import { type SettingResponse, SettingResponseScheme } from '../types/csharp';
import { joinEndpoint, throwIfNotOk } from '../utils/api';

export async function getSetting(): Promise<SettingResponse> {
	const response = await fetch(joinEndpoint('/api/setting'));

	throwIfNotOk(response);

	const json = await response.json();

	const result = SettingResponseScheme.parse(json);
	return result;
}
