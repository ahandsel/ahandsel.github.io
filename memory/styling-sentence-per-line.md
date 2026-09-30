# Keep each sentence on one source line

* Type: Styling
* Added: 2026-08-28
* Source: the Writing style section of [AGENTS.md](../AGENTS.md)

[AGENTS.md](../AGENTS.md) states the base rule: do not split a single sentence across multiple source lines.
Prefer giving each sentence its own source line, because editing one sentence then changes one source line and keeps diffs focused.
Do not reformat frontmatter, code blocks, tables, or other syntax-sensitive content solely to enforce sentence-per-line formatting.

Three mechanics apply wherever you apply the rule:

* Do not add a trailing space or a `<br>` element, because both create a visible line break instead of a soft one.
* Indent a continuation sentence to keep it inside the same list item, and repeat `>` on a continuation sentence inside a blockquote.
* Keep frontmatter values on their existing YAML lines, and do not convert a value to a block scalar in order to split its sentences.
