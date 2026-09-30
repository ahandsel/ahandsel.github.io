# Memory index

This folder contains durable notes for AI agents working in this repository.
[AGENTS.md](../AGENTS.md) and the style guides under `docs/` define the rules.
The memory files supplement those rules with non-obvious facts, decisions, and open questions from earlier sessions.


## How to use these memories

* Review this index before starting a task, then open only the memory files relevant to that task.
* Follow confirmed decisions and facts unless a more authoritative or newer repository source contradicts them.
* Treat open questions as unresolved.
  Do not assume an answer or present one as confirmed.
* If a memory conflicts with `AGENTS.md`, a style guide, or the current site content, follow the authoritative source and update or remove the outdated memory.


## Maintenance rules

* Create a memory only for a non-obvious fact, decision, or open question that future sessions will need and that is not already recorded in `AGENTS.md`, a style guide, the documentation, or the git history.
* Keep one subject in each memory file.
* Start each file with a title heading, followed by `Type`, `Added`, and `Source` list items and a short, actionable explanation.
* Use an ISO 8601 date in the `Added` item, such as `2026-08-28`.
* Make the `Source` item specific.
  Name the relevant file, pull request, or other authoritative source.
* Link related memories with relative Markdown links.
* Add every new memory to the contents section below with a concise description.
* Keep the contents section and this folder in sync.
  When they disagree, write the missing memory file or delete the stale entry.
* Update or delete a memory when it becomes incorrect or moves to an authoritative repository source.
  Update or delete its contents entry at the same time.
* An auto memory that Claude saves on its own arrives with YAML frontmatter and without the `Type`, `Added`, and `Source` items.
  Rewrite it into the format above and give it a category prefix the next time you touch it.

Name each memory file with a kebab-case slug that starts with one of these category prefixes:

* `auditing-`: Instructions for agents that review or verify content.
* `styling-`: Decisions about how to write or format repository content.
* `tooling-`: Decisions about repository configuration, automation, and developer tooling.
* `wording-`: Terminology choices and guidance about how to phrase repository content.


## Contents

* [Alert title lines must be plain text](styling-banner-title-plain-text.md) - VitePress prints a GitHub-style alert title verbatim, so keep bold text, code spans, links, and angle brackets on the second line or later.
* [Keep each sentence on one source line](styling-sentence-per-line.md) - Apply sentence-per-line formatting where Markdown or code syntax does not require another layout.
* [Markdown tables need manual pipe alignment](styling-markdown-tables-need-manual-pipe-alignment.md) - Prettier does not reflow tables here and markdownlint MD060 is not auto-fixable, so re-pad every row by hand when a cell changes width.
* [Prettier's shell plugin rewrites bash code fences in Markdown](styling-prettier-sh-mangles-bash-fences.md) - Angle-bracket placeholders in a fenced `bash` block are silently rewritten into redirections; use a shell variable.
* [.env.repo-audit is readable, but its contents stay private](tooling-env-repo-audit-read-rules.md) - The read is allowed while `Read(.env)` and `Read(.env.local)` stay denied, so quote only the value a task needs and never echo the whole file.
* [Copilot skill folders must be real copies, not symlinks](tooling-copilot-skills-need-real-copies.md) - GitHub Copilot does not support symlinks, so `.github/skills/` holds real copies that `sync-copilot-skills.yml` refreshes on pushes to `main`.
* [Never delete the devEngines.packageManager block](tooling-keep-devengines-packagemanager.md) - It is the only guard that makes npm fail in this pnpm-only repository, and the pnpm warning it causes is accepted noise.
* [Do not add a README.md inside contents/en/ or contents/ja/](tooling-no-readme-in-contents-locale-folders.md) - The locale folders are an owner-set exception to the per-folder README rule, even though the build and the parity check would both tolerate one.
* [Use "Changelog" (one word) not "change log" (two words)](wording-changelog-one-word.md) - Write the one-word form in headings, labels, table cells, and body prose, and correct the two-word form on the next pass through a file.
