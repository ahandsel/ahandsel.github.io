# markdownlint-cli2 appends command-line globs to the config globs

* Type: Tooling
* Added: 2026-11-02
* Source: The `globs` key in [`.markdownlint-cli2.jsonc`](../.markdownlint-cli2.jsonc) and the `Finding:` line that markdownlint-cli2 v0.24.0 prints

`.markdownlint-cli2.jsonc` sets `"globs": ["**/*.md"]` and `"fix": true`.
A glob or file path on the command line is added to that list, not used in its place.
So `markdownlint-cli2 --fix contents/en/about.md` lints and fixes every Markdown file in the repository, not one file.

Pass `--no-globs` to scope a run, for example `pnpm exec markdownlint-cli2 --no-globs --fix contents/en/about.md`.
`pnpm lint-contents` uses `--no-globs` for this reason, and `pnpm lint-md` passes no glob at all, matching `kws-writing`.
The `Finding:` line at the top of the output shows the patterns a run actually used, so check it when a run touches more files than expected.

See also [Keep the Prettier and markdownlint ignore lists in step](tooling-prettier-and-markdownlint-ignores-must-match.md).
