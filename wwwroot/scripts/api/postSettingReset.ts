import { SimpleResultResponseScheme } from '../types/csharp';
import { joinEndpoint, throwIfNotOk } from '../utils/api';

export default async function postSettingReset(): Promise<void> {
  const response = await fetch(joinEndpoint('/api/setting/reset'), {
    method: 'POST',
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
