# Do not add a README.md inside contents/en/ or contents/ja/

* Type: Tooling
* Added: 2026-08-28
* Source: the repository owner's decision on 2026-08-28, during a `readme-maintainer` audit that proposed one

The rule itself lives in the "README.md" section of [AGENTS.md](../AGENTS.md), which lists `contents/en/` and `contents/ja/` as exceptions to the per-folder `README.md` requirement.
This memory records why, because the reason is not visible from the tooling.

The exception is a deliberate authoring choice, not a technical limit, so do not revisit it after checking the tooling and concluding a README would be harmless.
It would in fact build cleanly:

* `contents/.vitepress/config.mts` sets `srcExclude: ['**/README.md']`, so VitePress never routes one as a page.
* `scripts/check-en-ja-parity.mjs` skips any file named `README.md`, so a README in one tree alone would not fail `pnpm check-en-ja-parity`.

The folders still need no README of their own.
[contents/README.md](../contents/README.md) already documents both trees, maps every page to its published URL, and describes the sibling `.vitepress/` and `public/` folders, so a per-locale README would only repeat it.
Add a page description there instead of creating a new file.

Note that a README added under `contents/` would still reach the tree snapshot in `docs/contents-structure.md`, so `pnpm tree` would need a rerun.

Also skip `contents/public/`: VitePress copies that folder to the site root untouched, so a README there would publish at <https://ahandsel.github.io/README.md>.
