# Skills

This folder contains local Codex skills used by this repository.


## Usage

To use a skill, enter the skill's name in the AI interface (VS Code extension, terminal prompt, or desktop app) with the appropriate prefix for AI tool.

| Tool           | Input       | Example                                       |
| -------------- | ----------- | --------------------------------------------- |
| Claude         | /skill-name | `/ai-commit --auto` or `/general-en-polisher` |
| Codex          | $skill-name | `$ai-commit --auto` or `$general-en-polisher` |
| GitHub Copilot | @skill-name | `@ai-commit --auto` or `@general-en-polisher` |

> [!TIP]
> Ask the AI `What does [skill name] do?` to get a description of the skill's functionality and usage instructions.


## Available skills


### Daily utility skills

| Skill                       | Description                                                                                                                                                                                                        | Last updated (UTC) |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| [`ai-commit`][]             | Auto-gather git changes, confirm scope with the user, and draft a commit title and message following the project commit style guide.                                                                               | 2026-06-03 13:30   |
| [`docs-sync-en-ja`][]       | Audits the `contents/en` and `contents/ja` trees for orphans and drift, then closes each gap with glossary-based translation and the polisher skills.                                                              | 2026-08-28 00:00   |
| [`general-en-polisher`][]   | Polishes Markdown files to enforce the repo core writing rules (straight quotes, no contractions, the Oxford comma, sentence case headings, plain hyphens, and more), then runs `link-polisher` on the same files. | 2026-06-03 09:37   |
| [`general-ja-polisher`][]   | Reviews Japanese Markdown for natural phrasing and compliance with repo Japanese style guides (general, technical, glossary, word list); edits by default, `--fix` to apply, `--report-only` for a dry run.        | 2026-06-22 00:00   |
| [`gh-sync-with-main`][]     | Bring the current git branch up to date with commits from the main branch (pull, rebase, or merge main).                                                                                                           | 2026-06-08 00:00   |
| [`ja-readability-editor`][] | Improves readability and scannability of Japanese Markdown documentation using plain Japanese and clear structure while preserving technical accuracy.                                                             | 2026-08-28 00:00   |
| [`ja-review-text`][]        | Rewrites AI-drafted Japanese text into natural, human-sounding Japanese without changing meaning or facts.                                                                                                         | 2026-08-28 00:00   |
| [`readability-editor`][]    | Improves readability and scannability of Markdown documentation using plain language and clear structure while preserving technical accuracy.                                                                      | 2026-08-28 00:00   |

[`ai-commit`]: ./ai-commit/SKILL.md
[`docs-sync-en-ja`]: ./docs-sync-en-ja/SKILL.md
[`general-en-polisher`]: ./general-en-polisher/SKILL.md
[`general-ja-polisher`]: ./general-ja-polisher/SKILL.md
[`gh-sync-with-main`]: ./gh-sync-with-main/SKILL.md
[`ja-readability-editor`]: ./ja-readability-editor/SKILL.md
[`ja-review-text`]: ./ja-review-text/SKILL.md
[`readability-editor`]: ./readability-editor/SKILL.md


### Repository maintenance skills

| Skill                         | Description                                                                                                                                                                                    | Last updated (UTC) |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| [`code-review`][]             | Audits a pull request against this repository's merge gate (automated checks plus style, parity, and index rules) and reports findings without editing anything.                               | 2026-08-28 00:00   |
| [`file-folder-name-linter`][] | Lints repository file and folder names against three fixed rules (`notes/` date prefix, `.yaml` not `.yml`, kebab-case) via `pnpm lint-naming`, with style-guide pointers for the reviewer.    | 2026-06-05 00:00   |
| [`pr-auditor`][]              | Blunt merge audit of an AI-written branch or pull request, treating its description, comments, and green checks as claims to verify, with severity-ranked findings.                            | 2026-08-28 00:00   |
| [`readme-maintainer`][]       | Audits the repository for missing or outdated folder `README.md` files and creates or updates them.                                                                                            | 2026-06-03 04:16   |
| [`script-auditor`][]          | Audits helper scripts in `scripts/` and `skills/*/scripts/` against the `AGENTS.md` script guidelines (no Python, prefer `.mjs` or zsh, require `--help`, a notes section, and status emojis). | 2026-06-04 01:36   |
| [`skill-allowlist-syncer`][]  | Fully syncs the `Skill(<name>)` entries in `.claude/settings.json` under `permissions.allow` with the skills in the repo `skills/` folder, adding new skills and removing deleted ones.        | 2026-06-01 09:37   |
| [`vitepress-include-lint`][]  | Verifies VitePress `<!--@include: ...-->` directives for strict comment formatting and valid target file paths.                                                                                | 2026-08-28 00:00   |

[`code-review`]: ./code-review/SKILL.md
[`file-folder-name-linter`]: ./file-folder-name-linter/SKILL.md
[`pr-auditor`]: ./pr-auditor/SKILL.md
[`readme-maintainer`]: ./readme-maintainer/SKILL.md
[`script-auditor`]: ./script-auditor/SKILL.md
[`skill-allowlist-syncer`]: ./skill-allowlist-syncer/SKILL.md
[`vitepress-include-lint`]: ./vitepress-include-lint/SKILL.md


### Other utility skills

| Skill                         | Description                                                                                                                                                      | Last updated (UTC) |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| [`gh-address-comments`][]     | Finds the open pull request for the current branch and works through its review and issue comments with the `gh` CLI.                                            | 2026-08-28 00:00   |
| [`gh-cli`][]                  | Interact with GitHub repositories using the GitHub CLI (gh). Covers PRs, issues, releases, workflow runs, and branch operations.                                 | 2026-05-14 06:13   |
| [`gh-fix-ci`][]               | Inspects failing GitHub Actions PR checks with `gh`, summarizes the failure, drafts a fix plan, and implements it after approval.                                | 2026-08-28 00:00   |
| [`gh-pr-generator`][]         | Drafts a structured pull request body from the branch diff (published URLs, pending tasks, collapsed detail) and opens the pull request with the `gh` CLI.       | 2026-08-28 00:00   |
| [`gh-pr-reporter`][]          | Fetches every comment on a GitHub PR (reviews, inline review comments, and general comments) and emits a single consolidated Markdown report.                    | 2026-06-04 14:30   |
| [`link-polisher`][]           | Rewrites raw URLs in Markdown files as Markdown links with a human-readable label fetched from the source (Figma file name, GitHub issue or pull request title). | 2026-06-03 04:16   |
| [`playwright`][]              | Drives a real browser from the terminal via `playwright-cli` for navigation, form filling, snapshots, screenshots, and UI-flow debugging.                        | 2026-08-28 00:00   |
| [`security-best-practices`][] | Language and framework specific security best-practice reviews for Python, JavaScript/TypeScript, and Go.                                                        | 2026-08-28 00:00   |
| [`security-threat-model`][]   | Repository-grounded threat modeling that enumerates trust boundaries, assets, abuse paths, and mitigations into a concise Markdown threat model.                 | 2026-08-28 00:00   |

[`gh-address-comments`]: ./gh-address-comments/SKILL.md
[`gh-cli`]: ./gh-cli/SKILL.md
[`gh-fix-ci`]: ./gh-fix-ci/SKILL.md
[`gh-pr-generator`]: ./gh-pr-generator/SKILL.md
[`gh-pr-reporter`]: ./gh-pr-reporter/SKILL.md
[`link-polisher`]: ./link-polisher/SKILL.md
[`playwright`]: ./playwright/SKILL.md
[`security-best-practices`]: ./security-best-practices/SKILL.md
[`security-threat-model`]: ./security-threat-model/SKILL.md
