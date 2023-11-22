import { BROWSER } from 'esm-env';
import { writable } from 'svelte/store';
import type { Updater } from 'svelte/store';

// saves having to branch for server vs client
const noopStorage = {
	getItem: (_key: string) => null,
	setItem: (_key: string, _value: string) => {}
};

export interface Options<T> {
	persist?: boolean;
	serializer?: {
		parse: (text: string) => T;
		stringify: (value: T) => string;
	};
}

export function web_storage<T>(name: string, defaultValue: T, options?: Options<T>) {
	const { persist, serializer } = { persist: true, serializer: JSON, ...options };
	const storage = BROWSER ? (persist ? localStorage : sessionStorage) : noopStorage;

	const persisted = storage.getItem(name);
	const parsed = persisted ? serializer.parse(persisted) : null;

	let value: T =
		typeof defaultValue === 'object'
			? Array.isArray(defaultValue)
				? parsed ?? [...defaultValue]
				: { ...defaultValue, ...parsed }
			: persisted
			  ? parsed
			  : defaultValue;

	const { subscribe, set: _set } = writable(value, () => {
		if (BROWSER && persist) {
			function handler(e: StorageEvent) {
				if (e.key === name) {
					_set((value = e.newValue ? serializer.parse(e.newValue) : defaultValue));
				}
			}

			addEventListener('storage', handler);
			return () => removeEventListener('storage', handler);
		}
	});

	function set(v: T) {
		_set((value = v));
		storage.setItem(name, serializer.stringify(value));
	}

	function update(updater: Updater<T>) {
		set(updater(value));
	}

	return {
		subscribe,
		set,
		update
	};
}
