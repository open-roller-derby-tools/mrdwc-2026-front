# MRDWC 2026 Frontend

The official website for the **Men's Roller Derby World Cup 2026** — a bilingual (French/English) event site built with Nuxt 4.

## Tech Stack

- **Nuxt 4** (Vue 3) — SSR framework
- **Pinia 3** — state management
- **Tailwind CSS 4** + **Nuxt UI** — styling and components
- **Directus** — headless CMS backend (remote)
- **@nuxtjs/i18n** — internationalisation (fr-FR default, en-US)
- **pnpm** — package manager

## Prerequisites

- Node.js (v22+)
- pnpm (`corepack enable` to use the version pinned in `package.json`)

## Environment Setup

Create a `.env` file in the project root:

```env
NUXT_PUBLIC_API_BASE=https://backend.mrdwc.org
```

This is the URL of the Directus CMS instance that serves all content and assets.

## Development

```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:3000)
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## Production

```bash
# Build for production
pnpm build

# Preview production build locally (uses .env)
pnpm preview

# Or run the built server manually (set NUXT_PUBLIC_API_BASE if not using .env)
NUXT_PUBLIC_API_BASE=https://backend.mrdwc.org node .output/server/index.mjs

# Static site generation
pnpm generate
```

## Project Structure

```
app/
├── components/        # Vue components
│   ├── blocks/        # Generic CMS block renderers
│   ├── blocks_custom/ # Domain-specific blocks (hero, venues, sponsors, etc.)
│   ├── navigation/    # Header, menus, language switcher
│   ├── partials/      # Reusable UI partials
│   └── icons/         # SVG icon components
├── layouts/           # Page layouts
├── pages/             # File-based routing (index + dynamic [slug])
├── stores/            # Pinia stores (pages, menus, teams, sponsors, venues, applications, options)
├── utils/             # Helper functions
└── assets/css/        # Tailwind theme and global styles
docs/                  # Architecture and component documentation
i18n/locales/          # Translation files (en.json, fr.json)
tests/                 # Unit tests
types/                 # TypeScript type definitions
```

See [`docs/`](docs/) for architecture and component documentation.

## Deployment

The site is deployed to a self-hosted server.
