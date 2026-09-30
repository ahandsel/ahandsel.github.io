# Markdown tables need manual pipe alignment

* Type: Decision
* Added: 2026-08-28
* Source: `pnpm lint-md` failure on `scripts/README.md` and `tests/README.md` while adding table rows, 2026-08-28.

Prettier does not reflow Markdown tables in this repository, and markdownlint rule MD060 (`table-column-style`) requires every pipe to align with the header row and is not auto-fixable.
When you add or widen a table cell, re-pad every row in the table by hand (or with a throwaway script) so all pipes line up, then re-run `pnpm lint-md`.
A literal `-` cell that means "not applicable" must keep its single hyphen plus space padding; do not let it become a full dash run, which reads as a divider row.
