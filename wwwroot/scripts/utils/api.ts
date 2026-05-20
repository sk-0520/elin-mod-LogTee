import { Environment } from './env';

type ApiPath = `/api/${string}`;

export function throwIfNotStatus(
  response: Response,
  expectedStatus: number[],
): void {
  if (!expectedStatus.includes(response.status)) {
    throw new Error(`Unexpected response status: ${response.status}`);
  }
}

export function throwIfNotOk(response: Response): void {
  throwIfNotStatus(response, [200]);
}

export function joinEndpoint(path: ApiPath): string {
  return `${Environment.baseEndpointUrl}${path}`;
}
