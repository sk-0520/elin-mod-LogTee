import { Environment } from './env';
import type { Language } from './language';
import { EventSourceReceiver } from './sse';
import {
  FileNotFoundResponseScheme,
  type TailKnownNotFoundResponse,
  type TailKnownSuccessResponse,
  TailSuccessResponseScheme,
  type TailUnknownResponse,
} from './types';

// process.env で差し替えれそうなんだけど rspack で対応する方法未調査(粗方済んだら対応する)
type ApiPath = `/api/${string}`;

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

export async function postSettingReset(): Promise<void> {
  const response = await fetch(joinEndpoint('/api/setting/reset'), {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Failed to reset setting. Status: ${response.status}`);
  }
}
