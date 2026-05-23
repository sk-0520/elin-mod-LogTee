export function get<T>(accessor: T | undefined | null): T {
	if (accessor === undefined) {
		throw new Error('undefined');
	}
	if (accessor === null) {
		throw new Error('null');
	}
	return accessor;
}

function dumpCore(target: unknown): unknown {
	if (target instanceof Error) {
		return {
			name: target.name,
			message: target.message,
			stack: target.stack,
		};
	}

	if (
		typeof target === 'number' ||
		typeof target === 'string' ||
		typeof target === 'boolean' ||
		typeof target === 'symbol' ||
		typeof target === 'function' ||
		target === null ||
		target === undefined
	) {
		return target;
	}

	return Object.fromEntries(
		Object.keys(target).map((a) => [a, dump(target[a as keyof typeof target])]),
	);
}

export function dump(target: unknown): unknown {
	return dumpCore(target);
}
