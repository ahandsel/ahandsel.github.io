# Keep the Prettier and markdownlint ignore lists in step

* Type: Tooling
* Added: 2026-11-02
* Source: [`.prettierignore`](../.prettierignore) and the `ignores` and `overrides` lists in [`.markdownlint-cli2.jsonc`](../.markdownlint-cli2.jsonc), modeled on the `kws-writing` repository

`pnpm lint` runs Prettier first and markdownlint-cli2 second.
Prettier rewrites every Markdown file into its own style: `-` list bullets and one blank line above each heading.
markdownlint-cli2 then puts back the house style from `MD004` and `MD022`: `*` bullets and two blank lines above each heading.
The pair round-trips, so a file that both tools lint ends up unchanged.

A path that markdownlint ignores but Prettier does not is left in Prettier's style after every `pnpm lint`.
Before 2026-11-02 this hit `.github/skills/` and the five vendored skills, so one lint run rewrote about 60 files with formatting-only changes.
It also made `pr-lint-autofix.yml` fight `sync-copilot-skills.yml` over the `.github/skills/` copies.

When you add a path to one ignore list, add it to the other in the same change.

The five vendored skills are the deliberate exception.
Prettier ignores them, but markdownlint-cli2 does not: the first entry in its `overrides` list lints them with `"default": false` and `MD004` only.
Their bullets therefore stay `*`, and the rest of their text stays as upstream wrote it.
A path that Prettier ignores and markdownlint lints is safe, because neither tool rewrites it into Prettier's style.
Keep that override filter and the vendored block in `.prettierignore` in step, and keep the override above the `.github/skills/**` one, because each file takes the first override whose filter matches it.

The two files match paths differently.
A markdownlint pattern such as `**/skills/playwright/**` matches at any depth.
In `.prettierignore`, a pattern with a slash before its end, such as `skills/playwright/`, is anchored to the repository root and misses `.github/skills/playwright/`.
Start a `.prettierignore` entry with `**/` when the markdownlint entry does.
In `kws-writing` the problem does not appear for `.github/skills/` because there it is a symlink, and Prettier does not follow symlinks; here it holds real copies, as [Copilot skill folders must be real copies, not symlinks](tooling-copilot-skills-need-real-copies.md) explains.

See also [markdownlint-cli2 appends command-line globs to the config globs](tooling-markdownlint-cli-globs-append-to-config.md).
