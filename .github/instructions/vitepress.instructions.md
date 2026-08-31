---
applyTo: 'contents/.vitepress/**'
---

# VitePress configuration and theme

These rules cover the site configuration and the custom theme.

Key files:

* `contents/.vitepress/config.mts` holds the site-wide configuration, including the English (default) and Japanese locales.
* `contents/.vitepress/theme/` holds the custom theme.

Review a change here for the following:

* Consult the official [VitePress documentation](https://vitepress.dev/) before proposing configuration or theme changes.
* Sidebar, navigation, and locale changes keep the English and Japanese trees reachable and consistent.
* Client-rendered behavior remains accessible by keyboard and works in both light and dark themes.
* A user-controlled value is not rendered as unsafe HTML or inserted into a URL, command, path, or response without appropriate validation.
