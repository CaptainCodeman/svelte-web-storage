# svelte-web-storage

A [Svelte writable store](https://svelte.dev/docs/svelte-store#writable) that saves values to [Web-Storage ](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API). Great for persisting settings or preference objects within your Svelte apps.

## Features

- ✅ Tiny size - just 608 bytes minified / 390 bytes minified & gzipped
- ✅ Supports `localStorage` for persistence and cross-tab synchronization
- ✅ Supports `sessionStorage` for independent per-tab values
- ✅ Store objects or atomic values
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

To use `sessionStorage` which isn't persisted or synchronized across tabs, pass `false` as a 3rd parameter (after the default value):

```ts
import { web_storage } from 'svelte-web-storage'

export const settings = web_storage('settings, {
  page_size: 24,
  currency: 'USD',
  language: 'en-US',
}, false) // <== disables persistence
```

## NOTE

If you add new properties to your settings object, they will be automatically added to any persisted values.