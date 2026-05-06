function ensureString(value: unknown): string {
  if (typeof value !== 'string') {
    throw new TypeError(typeof value);
  }
  return value;
}

export const Environment = {
  baseEndpointUrl: ensureString(process.env.ENDPOINT_BASE_URL),
};
