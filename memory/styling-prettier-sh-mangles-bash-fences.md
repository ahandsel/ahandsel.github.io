# Prettier's shell plugin rewrites bash code fences in Markdown

* Type: Styling
* Added: 2026-08-28
* Source: `prettier-plugin-sh` in the `plugins` list of [`.prettierrc.json5`](../.prettierrc.json5)

`pnpm lint` loads `prettier-plugin-sh`, which formats the contents of every fenced ` ```bash ` block in a Markdown file, not just standalone `.sh` files.
So a shell example in a Markdown file is parsed as real shell, and shfmt rewrites anything it reads as syntax.

The trap is the angle-bracket placeholder.
`gh pr diff <number> --name-only` parses as two redirections and comes back as `gh pr diff < number > --name-only`, and `gh pr view <number> --json title,body,files` is reordered to `gh pr view title,body,files < number > --json`, which silently turns a correct example into a wrong command.
Neither `pnpm lint` nor `markdownlint-cli2` reports anything, because the file is now formatted exactly as Prettier wants it.

Write a placeholder as a shell variable instead, for example `PR=123` on its own line followed by `gh pr diff "$PR" --name-only`.
Backticked angle brackets in prose are safe; only fenced shell blocks are reformatted.
After adding or editing a shell example in Markdown, run `pnpm exec prettier --write` on the file and reread the block to confirm shfmt left it alone.
Follow it with `pnpm exec markdownlint-cli2 --fix` on the same file, because `pnpm lint` runs the pair and Prettier on its own rewrites the `*` list bullets that markdownlint puts back.

See also [Keep each sentence on one source line](styling-sentence-per-line.md).
