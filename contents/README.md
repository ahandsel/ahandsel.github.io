# Contents


VitePress site source for [Genji Fujimori's portfolio][site]. This folder holds all bilingual page content, the VitePress config, and the custom theme.


## Layout

English is the default locale and lives at the site root. Japanese lives under [`ja/`](./ja/). The language switcher in the nav is rendered automatically from the `locales` config.

* `/` → [`index.md`](./index.md) (English home)
* `/about` → [`about.md`](./about.md) (English about)
* `/ja/` → [`ja/index.md`](./ja/index.md) (Japanese home)
* `/ja/about` → [`ja/about.md`](./ja/about.md) (Japanese about)
* `/en/...` → redirect stubs generated at build time that point back to the canonical English path

When adding a new page, create the file in both locales and register it under the matching `themeConfig.nav` and `themeConfig.sidebar` entries in [`.vitepress/config.mts`](./.vitepress/config.mts).


## Subfolders

* [`.vitepress/`](./.vitepress/) - VitePress configuration and the custom theme.
  * `config.mts` - Site config, locales, theme config, and the `buildEnd` hook that emits `/en/*` redirect stubs.
  * `theme/` - Custom theme entry and overrides.
* [`ja/`](./ja/) - Japanese pages, mirroring the structure of the English pages at the root.


## Local commands

Run these from the repository root.

* `pnpm contents-dev` - Start the dev server.
* `pnpm contents-build` - Build the production bundle into `.vitepress/dist/`.
* `pnpm contents-preview` - Serve the production build locally.
* `pnpm writing` - Run lint, regenerate the contents tree, and start the dev server.


[site]: https://ahandsel.github.io
