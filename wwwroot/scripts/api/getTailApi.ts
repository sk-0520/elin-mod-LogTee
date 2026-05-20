import {
  FileNotFoundResponseScheme,
  type TailKnownNotFoundResponse,
  type TailKnownSuccessResponse,
  TailSuccessResponseScheme,
  type TailUnknownResponse,
} from '../types/csharp';
import { joinEndpoint, throwIfNotOk } from '../utils/api';

export default async function getTailApi(): Promise<TailUnknownResponse> {
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
