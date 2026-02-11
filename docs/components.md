# Components and Stores

## Component Organisation

```
app/components/
├── blocks/            # Generic CMS block renderers
│   ├── BlockRichText.vue
│   ├── BlockCustom.vue
│   ├── BlockTwoColumns.vue
│   └── BlockTabs.vue
├── blocks_custom/     # Domain-specific blocks (resolved by name via BlockCustom)
│   ├── BlockHero.vue
│   ├── BlockVenues.vue
│   ├── BlockApplications.vue
│   ├── BlockSponsors.vue
│   └── BlockTickets.vue
├── navigation/
│   ├── HeaderNav.vue      # Responsive header (hamburger on mobile, horizontal on desktop)
│   ├── HeaderMenu.vue     # Dynamic menu populated from CMS
│   └── LangSwitcher.vue   # EN/FR language toggle
├── partials/          # Reusable UI fragments (PageHeader, Venue card, Application card, etc.)
└── icons/             # SVG icon components
```

## Block System

The CMS defines pages as ordered lists of blocks. The frontend renders them dynamically:

1. `BlockCustom` receives a block with a `name` field (e.g. `"BlockHero"`)
2. It uses `getBlockComponent(name)` to resolve the matching Vue component from `blocks_custom/`
3. The resolved component is rendered with the block data as props

This means new custom block types can be added by:
1. Creating the block in Directus
2. Adding a Vue component in `blocks_custom/`
3. Registering it in the `components` map in `app/utils/getBlockComponent.ts`

## Stores

All stores use the Pinia **Setup Store** pattern (composition API). Each store manages one CMS collection.

| Store | Collection | Key getters |
|-------|-----------|-------------|
| `pages` | Pages + nested blocks | `getPageWithSlug(slug)` — fully localised page with blocks |
| `menus` | Navigation menus | `getMenuWithName(name)` — localised menu items |
| `teams` | Teams + members | `localizedTeams` — teams with translated bios and pronouns |
| `sponsors` | Sponsors | `localizedSponsors` — sponsors with translated descriptions |
| `venues` | Event venues | `localizedVenues` — venues with translated names/addresses |
| `applications` | Tournament applications | `getApplicationsWithStatus(statuses)` — filtered by status |
| `options` | Site-wide settings | `localizedOptions` — event dates, social links, etc. |

All stores follow the same pattern:
- `fetch()` action calls the Directus API once (via `callOnce` in the layout)
- Raw data (all locales) is stored in a `ref`
- Computed getters resolve the current locale with fallback to the default
