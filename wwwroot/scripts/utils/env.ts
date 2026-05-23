function ensureString(value: string | undefined): string {
	if (value === undefined) {
		throw new TypeError('Value is undefined');
	}

	return value;
}

export const Environment = {
	baseEndpointUrl: ensureString(process.env.ENDPOINT_BASE_URL),
	isDebug: process.env.IS_DEBUG === 'true',
};
