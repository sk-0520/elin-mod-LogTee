import { Environment } from './env';
import type { Language } from './language';
import { EventSourceReceiver } from './sse';
import {
  FileNotFoundResponseScheme,
  type SettingResponse,
  SettingResponseScheme,
  SimpleResultResponseScheme,
  type TailKnownNotFoundResponse,
  type TailKnownSuccessResponse,
  TailSuccessResponseScheme,
  type TailUnknownResponse,
} from './types';

// process.env で差し替えれそうなんだけど rspack で対応する方法未調査(粗方済んだら対応する)
type ApiPath = `/api/${string}`;

function throwIfNotStatus(response: Response, expectedStatus: number[]): void {
  if (!expectedStatus.includes(response.status)) {
    throw new Error(`Unexpected response status: ${response.status}`);
  }
}

function throwIfNotOk(response: Response): void {
  throwIfNotStatus(response, [200]);
}

function joinEndpoint(path: ApiPath): string {
  return `${Environment.baseEndpointUrl}${path}`;
}

export async function getTailApi(): Promise<TailUnknownResponse> {
  const response = await fetch(joinEndpoint('/api/tail'), {
    method: 'GET',
  });

  if (response.status === 404) {
    const json = await response.json();
    return {
      mode: 'not-found',
      data: FileNotFoundResponseScheme.parse(json),
    } satisfies TailKnownNotFoundResponse;
  }

  throwIfNotOk(response);

  const json = await response.json();
  const result = TailSuccessResponseScheme.parse(json);
  return {
    mode: 'success',
    data: result,
  } satisfies TailKnownSuccessResponse;
}

export function getSocketStream(language: Language): EventSourceReceiver {
  return new EventSourceReceiver(
    joinEndpoint('/api/stream/socket'),
    'socket',
    language,
  );
}

export function getFileStream(language: Language): EventSourceReceiver {
  return new EventSourceReceiver(
    joinEndpoint('/api/stream/file'),
    'file',
    language,
  );
}

export async function getSetting(): Promise<SettingResponse> {
  const response = await fetch(joinEndpoint('/api/setting'));

  throwIfNotOk(response);

  const json = await response.json();

  const result = SettingResponseScheme.parse(json);
  return result;
}

export async function postSettingReset(): Promise<void> {
  const response = await fetch(joinEndpoint('/api/setting/reset'), {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Failed to reset setting. Status: ${response.status}`);
  }

  const json = await response.json();
  const result = SimpleResultResponseScheme.parse(json);
  if (!result.success) {
    throw new Error(
      `Failed to reset setting. Details: ${JSON.stringify(result.details)}`,
    );
  }
}
