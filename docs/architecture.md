# Architecture

## Overview

The site is a **Nuxt 4 SSR frontend** that consumes content from a **Directus CMS backend** hosted at `backend.mrdwc.org`. The frontend owns all presentation — layout, styling, routing, and internationalisation. The backend owns all content — pages, blocks, teams, sponsors, venues, and site options.

```
┌──────────────┐        REST API        ┌──────────────────┐
│  Nuxt server │  ───────────────────►  │  Directus CMS    │
│  (SSR)       │  /items/{collection}   │  backend.mrdwc   │
└──────┬───────┘                        └──────────────────┘
       │                                        ▲
       │  HTML + hydrated state                 │
       ▼                                        │
┌──────────────┐        /assets/{id}            │
│  Browser     │  ──────────────────────────────┘
│  (client)    │  (images loaded directly)
└──────────────┘
```

## Data Flow

1. The default layout (`app/layouts/default.vue`) calls `callOnce(store.fetch)` for each Pinia store during SSR.
2. Each store's `fetch()` action uses `$fetch()` with a URL built by `buildRESTURL()` to call the Directus REST API.
3. The raw API response (with all locale variants) is stored in the Pinia state.
4. Computed getters in each store resolve the current locale's translation at render time, with fallback to the default locale.
5. The hydrated state is sent to the browser — the client does **not** re-fetch data from the API.

## CMS Block System

Pages in Directus are composed of polymorphic **blocks**. Each block has a `collection` name (e.g. `blocks_richtext`, `blocks_custom`) and an `item` payload.

On the frontend, `getBlockComponent()` (`app/utils/getBlockComponent.ts`) maps collection names to Vue components. Pages render blocks dynamically:

```vue
<component :is="getBlockComponent(block.collection)" :data="block" />
```

Block types:
- `blocks_richtext` — translated rich text content
- `blocks_custom` — named custom blocks (hero, venues, sponsors, etc.)
- `blocks_two_columns` — two-column layout, each column containing nested blocks
- `blocks_tabs` — tabbed view referencing other pages by slug

## Internationalisation

- **Two locales:** `fr-FR` (default) and `en-US`
- **CMS translations:** each translatable entity has a `translations` array keyed by `languages_code`. Stores resolve the active locale with fallback.
- **UI strings:** local JSON files in `i18n/locales/` (`en.json`, `fr.json`) for static text like navigation labels and meta descriptions.

## Asset Handling

Images and files are served directly from Directus at `{apiBase}/assets/{id}`. The browser fetches these directly — they do not go through the Nuxt server. `@nuxt/image` with WebP optimisation is used for rendering.
