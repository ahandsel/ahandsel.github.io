# Contents

VitePress site source for [Genji Fujimori's portfolio](https://ahandsel.github.io).
This folder holds all bilingual page content, the VitePress config, and the custom theme.


## Layout

English lives under [`en/`](./en/).
Japanese lives under [`ja/`](./ja/).
The language switcher in the nav is rendered automatically from the `locales` config.

* `/` → [`index.md`](./index.md) (redirects to English home)
* `/en/` → [`en/index.md`](./en/index.md) (English home)
* `/en/about` → [`en/about.md`](./en/about.md) (English about)
* `/en/projects` → [`en/projects.md`](./en/projects.md) (English projects)
* `/en/talks` → [`en/talks.md`](./en/talks.md) (English talks)
* `/ja/` → [`ja/index.md`](./ja/index.md) (Japanese home)
* `/ja/about` → [`ja/about.md`](./ja/about.md) (Japanese about)
* `/ja/projects` → [`ja/projects.md`](./ja/projects.md) (Japanese projects)
* `/ja/talks` → [`ja/talks.md`](./ja/talks.md) (Japanese talks)
* `/about`, `/projects`, and `/talks` → redirect stubs generated at build time that point to the canonical English path

When adding a new page, create the file in both locales and register it under the matching `themeConfig.nav` and `themeConfig.sidebar` entries in `.vitepress/config.mts`.


## Subfolders

* `.vitepress/` - VitePress configuration and the custom theme.
  * `config.mts` - Site config, locales, theme config, and the `buildEnd` hook that emits root-level English redirect stubs.
  * `theme/` - Custom theme entry and overrides.
* [`en/`](./en/) - English pages, mirroring the Japanese page structure.
* [`ja/`](./ja/) - Japanese pages, mirroring the English page structure.
* [`public/`](./public/) - Static assets served as-is.
  VitePress copies every file here to the site root without processing it, so `public/favicon.ico` is published at `/favicon.ico` and `public/robots.txt` at `/robots.txt`.
  Reference an image from a page by its root-relative path, as the hero image in [`en/index.md`](./en/index.md) does with `/kamikochi-bridge-hiking-sketch-color-crop.png`.


## Local commands

Run these from the repository root.

* `pnpm vitepress-dev` - Start the dev server.
* `pnpm vitepress-build` - Build the production bundle into `.vitepress/dist/`.
* `pnpm vitepress-preview` - Serve the production build locally.
* `pnpm dev` - Run lint, regenerate the contents tree, and start the dev server.
