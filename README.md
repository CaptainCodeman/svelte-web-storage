# svelte-web-storage

A [Svelte writable store](https://svelte.dev/docs/svelte-store#writable) that saves values to [Web-Storage ](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API). Great for persisting settings or preference objects within your Svelte apps. There are lots of packages available that do similar things, see the [comparison](#comparison) for why you might want to use this particular lib.

## Features

- ✅ Tiny size - just 656 bytes minified / 417 bytes minified & gzipped
- ✅ Supports `localStorage` for persistence and cross-tab synchronization
- ✅ Supports `sessionStorage` for independent per-tab values
- ✅ Store objects, primitive values, and arrays
- ✅ Customizable serialization (uses JSON by default)
- ✅ New default properties automatically added to persisted values
- ✅ Server-side-rendering (SSR) compatible

## Usage

### Installation

Install using your package manager of choice, e.g.

    pnpm i -D svelte-web-storage

### LocalStorage

Import and create a `Writable` store, just as you would with the default Svelte `writable` but passing in a key name of storage before the default value(s).

```ts
import { web_storage } from 'svelte-web-storage'

export const settings = web_storage('settings, {
  page_size: 24,
  currency: 'USD',
  language: 'en-US',
})
```

Your settings can be accessed throughout your app and will be persisted to localStorage and changes to settings will be synchronized across browser tabs.

### SessionStorage

To use `sessionStorage` which isn't persisted or synchronized across tabs, use a 3rd options parameter to set `persist` to `false`:

```ts
import { web_storage } from 'svelte-web-storage'

export const settings = web_storage('settings, {
  page_size: 24,
  currency: 'USD',
  language: 'en-US',
}, { persist: false }) // <== disables persistence
```

### Custom Serialization

Persisted data is stored using `JSON.parse` and `JSON.stringify` but this can be overridden by passing in a `serializer` as part of the 3rd options parameter. This might be because you have some legacy format that you want to use:

```ts
import { web_storage } from 'svelte-web-storage'

export const settings = web_storage('settings, {
  page_size: 24,
  currency: 'USD',
  language: 'en-US',
}, {
  serializer: {
    parse(text: string) {
      const parts = text.split(':');
      return {
        page_size: parseInt(parts[0]),
        currency: parts[1],
        language: parts[2]
      };
    },
    stringify(value) {
      return `${value.page_size}:${value.currency}:${value.language}`;
    }
  }
})
```

### Upgrading Objects

If you add new properties to your settings object, the new default values of those properties will be automatically added to any persisted values. Adding a `theme` property to the previous example would set the store value to `system`, but leave any existing customized properties unchanged. No need to manually handle properties missing from the persisted state, or your settings having possibly undefined values.

```ts
import { web_storage } from 'svelte-web-storage'

export const settings = web_storage('settings, {
  page_size: 24,
  currency: 'USD',
  language: 'en-US',
  theme: 'system',
})
```

## Comparison (work in progress)

There are lots of packages that do similar things to this lib, so why might you want to use this one? I've tried to put together a comparison of all the ones I could find - I'm not claiming it's an exhaustive or a 100% accurate list, so let me know if there is something I've missed or you think is incorrect.

The criteria for comparing includes:

- **Byte size** of package
  - what impact will using the lib have on your application bundle size (using https://bundlephobia.com/)
- **Correctness**
  - stores should correctly handle unsubscribing to prevent bugs and memory leaks
- **Upgradeable**
  - does it handle adding new properties without overwriting the defaults?
- **Server-Side-Rendering** (SSR) compatibility
  - older libs that pre-date SvelteKit often lack support for SSR
- **Svelte Compatible**
  - Can it be used outside of SvelteKit (does it use any $app dependencies)
- **Web-Storage**
  - are both localStorage _and_ sessionStorage types of web-storage supported?
- **Synchronization of browser tabs**
  - are changes in one tab reflected in another when using localStorage?
- **objects, primitive values, and Arrays**
  - can it be used with primitive values, objects, and arrays
- **TypeScript** Support
  - are typings provided
- **Custom Serialization**
  - JSON is a sensible default but can it be overridden?
- **Handsomeness** of the author
  - that's a joke, to see if anyone read this far ...

| Name                                | Version | Minified | GZipped | Correct | Upgrade | SSR | SK Deps | Session | Sync | Values | TS  | Serialize |
| ----------------------------------- | ------- | -------: | ------: | :-----: | :-----: | :-: | :-----: | :-----: | :--: | :----: | :-: | :-------: |
| svelte-web-storage                  | 0.0.2   |     656B |    417B |   ✅    |   ✅    | ✅  |   ✅    |   ✅    |  ✅  |   ✅   | ✅  |    ✅     |
| svelte-persisted-store              | 0.7.0   |   1.24kB |    650B |   ✅    |   ❓    | ❓  |   ❓    |   ❓    |  ❓  |   ❓   | ❓  |    ❓     |
| svelte-persistent-store             | 0.1.6   |    1.7kB |    837B |   ✅    |   ❓    | ❓  |   ❓    |   ❓    |  ❓  |   ❓   | ❓  |    ❓     |
| svelte-backed-store                 | 1.1.1   |    3.5kB |  1.25kB |   ✅    |   ❓    | ❓  |   ❓    |   ❓    |  ❓  |   ❓   | ❓  |    ❓     |
| svelte-persistent-writable          | 1.1.6   |    1.4kB |    631B |   ✅    |   ❓    | ❓  |   ❓    |   ❓    |  ❓  |   ❓   | ❓  |    ❓     |
| svelte-localstorage-writable        | 0.1.3   |     960B |    519B |   ✅    |   ❓    | ❓  |   ❓    |   ❓    |  ❓  |   ❓   | ❓  |    ❓     |
| svelte-syncable                     | 1.0.4   |          |         |   ❌    |   ❓    | ❓  |   ❓    |   ❓    |  ❓  |   ❓   | ❓  |    ❓     |
| svelte-storable                     | 1.0.4   |      1kB |    509B |   ✅    |   ❓    | ❌  |   ❓    |   ❓    |  ❓  |   ❓   | ❓  |    ❓     |
| svelte-cached-store                 |         |          |         |   ❌    |   ❓    | ❓  |   ❓    |   ❓    |  ❓  |   ❓   | ❓  |    ❓     |
| @macfja/svelte-persistent-store     | 2.4.1   |   19.9kB |   7.3kB |   ✅    |   ❓    | ❓  |   ❓    |   ❓    |  ❓  |   ❓   | ❓  |    ❓     |
| @macfja/browser-storage-store       | 1.0.0   |    4.2kB |   1.9kB |   ✅    |   ❓    | ❓  |   ❓    |   ❓    |  ❓  |   ❓   | ❓  |    ❓     |
| @n0n3br/svelte-persist-store        | 1.0.2   |    8.4kB |   2.9kB |   ✅    |   ❓    | ❓  |   ❓    |   ❓    |  ❓  |   ❓   | ❓  |    ❓     |
| @babichjacob/svelte-localstorage    |         |          |         |   ✅    |   ❓    | ❓  |   ❓    |   ❓    |  ❓  |   ❓   | ❓  |    ❓     |
| @typhonjs-svelte/simple-web-storage |         |          |         |   ✅    |   ❓    | ❓  |   ❓    |   ❓    |  ❓  |   ❓   | ❓  |    ❓     |
| @thegrommet/svelte-syncable         | 2.0.0   |     846B |    447B |   ❌    |   ❓    | ❓  |   ❓    |   ❓    |  ❓  |   ❓   | ❓  |    ❓     |
| @furudean/svelte-persistent-store   | 0.8.0   |     881B |    494B |   ✅    |   ❓    | ❓  |   ❓    |   ❓    |  ❓  |   ❓   | ❓  |    ❓     |

### Methodology:

- Check source-code for subscription handling pluse dependencies on SvelteKit.
- Tested each library by importing, creating a test page, and seeing how it handled both SSR, objects vs values, adding properties, etc...
- Used [Bundlephobia](https://bundlephobia.com/) to check the size of packages, falling back to published NPM distributed size.
