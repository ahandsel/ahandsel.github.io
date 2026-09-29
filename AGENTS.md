# Repository rules

These rules apply to all AI agents working in this repository. This is the canonical instructions file.


## Project overview

This is a personal portfolio site built with [VitePress](https://vitepress.dev/) and published at <https://ahandsel.github.io>.
Site content lives in `contents/`, with English pages under `contents/en/` and Japanese pages under `contents/ja/`.
The repository also holds documentation writing style guides, templates, terminology resources, and the reusable AI workflows in `skills/`.


## Repository structure

* `contents/` - VitePress site content and configuration. English pages in `en/`, Japanese pages in `ja/`, and the config and custom theme in `.vitepress/`.
* `docs/` - Documentation writing style guides, templates, the EN-JA glossary, and the generated `contents-structure.md` snapshot. Indexed by [docs/README.md](docs/README.md).
* `memory/` - Durable cross-session notes for AI agents, indexed by [memory/MEMORY.md](memory/MEMORY.md)
* `notes/` - Dated research and reference notes, indexed by [notes/README.md](notes/README.md)
* `prompts/` - Reusable `*.prompt.md` files, indexed by [prompts/README.md](prompts/README.md)
* `scripts/` - Development tools and automation scripts, indexed by [scripts/README.md](scripts/README.md)
* `skills/` - Reusable AI workflows, each with a `SKILL.md` file, indexed by [skills/README.md](skills/README.md)

This repository has no `agents/` folder and defines no custom subagents. Load the matching skill directly.


### README.md

* Each folder should contain a `README.md` file that describes the contents and purpose of the folder. This helps maintain clarity and discoverability as the repository grows.
* Ensure that they are kept up to date with any changes to the folder's contents or purpose.
* Three folders are exceptions:
  * `memory/` - [memory/MEMORY.md](memory/MEMORY.md) is that folder's index, so do not add a `README.md` to it.
  * `contents/en/` and `contents/ja/` - these hold pages only. [contents/README.md](contents/README.md) documents both trees and maps every page to its published URL, so do not add a `README.md` to either. See [memory/tooling-no-readme-in-contents-locale-folders.md](memory/tooling-no-readme-in-contents-locale-folders.md) for why the build tolerating one is not a reason to add it.


## Setup and commands

* `pnpm install` - Install dependencies.
* `pnpm dev` - Run lint, regenerate the contents tree, then start the VitePress dev server.
* `pnpm check` - Run the full local gate: lint, script tests, typecheck, name lint, license check, en/ja parity, contents tree, and production build. Run it before every commit.
* `pnpm check-en-ja-parity` - Check that every page in `contents/en` has a counterpart in `contents/ja` and that paired pages agree on the sync-critical frontmatter fields.
* `pnpm test` - Run the script test suite in `tests/` with the Node built-in test runner.
* `pnpm typecheck` - Type-check the VitePress config and theme with `vue-tsc`, using the include list in `tsconfig.json`.
* `pnpm lint` - Format code with Prettier and fix Markdown with markdownlint-cli2 across the repository. Fix all reported errors.
* `pnpm lint-contents` - Run the same formatting pass, limited to `contents/`.
* `pnpm lint-naming` - Check file and folder names with the `file-folder-name-linter` skill.
* `pnpm license` - Run the license check with `@cybozu/license-manager`.
* `pnpm tree` - Regenerate [docs/contents-structure.md](docs/contents-structure.md). Run it and commit the result whenever you add, remove, rename, or move a page under `contents/`.
* `pnpm test-tree` - Check that snapshot against `contents/` without writing to it.
* `pnpm vitepress-dev` - Start the VitePress dev server only.
* `pnpm vitepress-build` - Build the site for production.
* `pnpm vitepress-preview` - Preview an existing production build locally.
* `pnpm preview` - Build the site and then preview it.
* `pnpm index` - List every `pnpm` script defined in `package.json`.
* `pnpm clean` - Remove the VitePress cache and `dist` folders.
* `pnpm cleanup` - Find temporary files, delete the empty ones, and prompt before deleting the rest.
* `pnpm vitepress-update` - Upgrade VitePress to the latest `@next` release.

The command names and semantics intentionally match the ones in the owner's other documentation repositories, so the same muscle memory works everywhere.


## VitePress

This site is built with VitePress. For any VitePress-related question, configuration, customization, or troubleshooting, consult these official resources first:

* [VitePress documentation](https://vitepress.dev/) - official guides, configuration reference, and default theme API.
* [vuejs/vitepress on GitHub](https://github.com/vuejs/vitepress) - source code, issues, and release notes.


## Site URLs

The published site is <https://ahandsel.github.io>.

Build a page URL from its source path under `contents/` using the VitePress routing rules:

* English pages keep the `/en/` prefix. For example, `contents/en/about.md` maps to <https://ahandsel.github.io/en/about>.
* Japanese pages keep the `/ja/` prefix. For example, `contents/ja/about.md` maps to <https://ahandsel.github.io/ja/about>.
* An `index.md` file maps to its folder root. For example, `contents/en/index.md` maps to <https://ahandsel.github.io/en/>.
* `cleanUrls` is not enabled, so the build emits `.html` files and the site's own links carry the extension, such as `/en/about.html`. GitHub Pages also serves the extensionless path, so either form resolves.
* The site root (`/`) redirects to `/en/` through `contents/index.md`. English is still the root locale, so the language switcher shows no phantom entry.
* The `buildEnd` hook in `contents/.vitepress/config.mts` writes a root-level redirect stub for every English page, so a legacy link such as `/about` still reaches `/en/about`. The hook runs on production builds only, not under `vitepress dev`.
* The build also emits LLM-facing output through `vitepress-plugin-llms`: `/llms.txt`, `/llms-full.txt`, and a raw `.md` twin beside every participating English page, such as `/en/about.md`. The participating pages and the button-visibility rule live in `contents/.vitepress/llms-pages.ts`.

Apply these rules whenever URLs are involved:

* When a user requests the URL for one or more pages, return the published URLs built from the domain above.
* When opening a pull request that adds new pages, include the published URL for each new page in the pull request description.


## Skills

Prioritize local skills in `skills/` over external or global skills.

1. Check [skills/README.md](skills/README.md) for the full index.
2. Load and follow `skills/<skill-name>/SKILL.md` before starting work.
3. If a local skill and an external skill overlap, use the local skill.

Skill maintenance:

* When adding, renaming, or removing a repo skill, update `skills/README.md` and reconcile the skill allowlist in `.claude/settings.json` with `node skills/skill-allowlist-syncer/scripts/check-skill-allowlist.mjs`.
* Run the allowlist script in check mode first. If it reports `result:drift`, rerun with `--write` only after confirming that the shared `.claude/settings.json` should change.
* If `skills/README.md` and the `skills/` folder disagree, treat the `skills/<skill-name>/SKILL.md` files as canonical and fix the index drift.


## Memory

Cross-session notes for AI agents live in the top-level `memory/` folder.
Each memory is one file holding one fact, decision, or open question, and [memory/MEMORY.md](memory/MEMORY.md) is the index that lists them all.

@memory/MEMORY.md

* The index above loads automatically with this file.
  The individual memory files do not, so open the ones the task touches before starting work.
* The folder records what this file and the style guides do not cover: styling decisions, rendering gotchas, and questions still waiting on a decision.
* When a session produces a non-obvious learning, add a new memory file and its index line, following the maintenance rules in `memory/MEMORY.md`.
  Write the memory itself in that file; the index carries only its one-line entry.
* Name each memory file with a kebab-case slug.
  Do not add a `README.md` to `memory/`; `MEMORY.md` is that folder's index.
* `.claude/settings.json` sets `autoMemoryDirectory` to this folder, so Claude Code saves its own auto memory here instead of under `~/.claude/projects/`.
  Those files arrive with YAML frontmatter; rewrite one into the `memory/MEMORY.md` format the next time you touch it, and remember that everything here is tracked by git.


## Web research

Reaching a website is not a free action.
Before you read anything on the web, present the list of sites you want to check and wait for the user to approve it.

The rule covers every route to the network:

* The `WebFetch` and `WebSearch` tools.
* A browser session driven by the `playwright` skill.
* Any shell command that makes a request, such as `curl`, `wget`, `npx`, `pnpm dlx`, or an inline `node -e` script that calls `fetch`.
* An MCP server that reads a remote resource for you.

The rule is about reaching the network, not about running Node.
The repository scripts under `scripts/` and `skills/<skill-name>/scripts/` stay allowed, and so do the `gh` commands in the allowlist, because they act on this repository rather than on the open web.


### How to ask

1. Stop before the first request.
2. List every site you want to visit, one per line, giving the URL or the domain and one short sentence on what you need from it.
3. Wait for the user to approve the list. Do not treat silence, a related instruction, or your own judgment as approval.
4. Visit only what the user approved. When the work turns up a site that is not on the approved list, ask again before you follow it.

Approval covers the task at hand only, so a later task starts over even in the same session.
A URL that the user puts in the request is already approved, and so is a page linked from it when the user tells you to follow the link.


### Standing allowlist

Some sites are approved in advance and need no ask.
They live in [.claude/settings.json](.claude/settings.json) under `permissions.allow` as `WebFetch(domain:<host>)` entries, which is the same list Claude Code enforces, so the repository keeps one list rather than two.
Read that list before you ask, and leave an already-approved site out of the list you present.

The list starts small on purpose:

* `ahandsel.github.io` - the published site, for checking a live page.
* `github.com` and `raw.githubusercontent.com` - this repository, its issues, and its pull requests.
* `vitepress.dev` - the VitePress documentation that the "VitePress" section above sends you to.

To add a site, add a `WebFetch(domain:<host>)` entry to the `allow` array and keep the array sorted.
To remove one, delete its entry.
The repository owner decides what belongs on this list.


### What the permission rules do

`.claude/settings.json` backs the rule for Claude Code:

* The `WebFetch(domain:<host>)` entries in `allow` let the standing allowlist through without a prompt.
* Every other host prompts, because `WebFetch` carries no blanket `allow` entry.
* `WebSearch` sits in `ask`, so a search always prompts.
* `curl`, `wget`, `npx`, `pnpm dlx`, and the inline `node -e` and `node --eval` forms sit in `ask`.

Those entries match a literal command prefix, so they raise the bar rather than seal it, and a request phrased another way still reaches the network.
This repository deliberately does not deny `node` outright, because its own tooling is Node and that ban would cost far more than it buys.
The written rule above is what actually binds you, it binds every agent rather than Claude Code alone, and no permission list replaces it.


## Copilot instructions

GitHub Copilot reads its own instruction files, which restate for Copilot what this file already says for every other agent.

* [.github/copilot-instructions.md](.github/copilot-instructions.md) is the repository-wide set that GitHub loads for Copilot code review and for authoring.
* `.github/instructions/*.instructions.md` carry the path-scoped detail, and GitHub applies one on top of the repository-wide file when a changed file matches its `applyTo` glob.
* `.github/skills/<skill-name>` holds a real copy of the matching `skills/<skill-name>` folder because GitHub Copilot does not support symlinks. The folder under `skills/` stays canonical: edit the skill there only, and let `.github/workflows/sync-copilot-skills.yml` open a pull request that refreshes the copy after the push to `main`.
* This file stays the primary instruction source. Keep a rule here and let the Copilot files point at it, rather than moving a rule into `.github/`.
* When you add, rename, or remove a scoped file, update the instruction-file list in `.github/copilot-instructions.md`.


## File and folder naming

* Use `lowercase-with-dashes` for all file and folder names.
* Use the `.yaml` extension for YAML files, not `.yml`, except when an external tool or platform requires a specific filename. Files inside dot-folders such as `.github/` are exempt.
* Name each file in `notes/` `YYYY-MM-DD-<slug>.md` so notes sort chronologically and each file states its own date.
* `pnpm lint-naming` runs the `file-folder-name-linter` skill and enforces these rules, and `pnpm check` includes it. Add a project-specific exception to `.namelintignore` rather than loosening a rule.
* When renaming a file or folder, update every reference to it across documentation, scripts, and code so that file paths and content remain accurate and consistent.


## Writing style

Apply these rules when reviewing or creating content. They cover Markdown prose and prose comments in scripts and other code files, and no automated check enforces them.

* Use straight quotes, not curly quotes.
* Do not use contractions (write "do not" instead of "don't").
* Use the Oxford comma.
* Use sentence case for headings (capitalize only the first word and proper nouns).
* Never use en-dash or em-dash; always use a plain hyphen (`-`) instead.
* Do not split a single sentence across multiple source lines; wrap prose only at sentence boundaries.
* Give each sentence its own source line wherever a soft line break preserves the rendered output. This keeps diffs focused, because editing one sentence then changes one source line.
* Do not reformat frontmatter, code blocks, tables, or other syntax-sensitive content solely to enforce sentence-per-line formatting.
* Keep wording simple for non-native English speakers. Avoid slang and idioms.
* Maintain consistent capitalization and punctuation throughout a document.


## Markdown formatting

* When writing or editing any Markdown file, follow [docs/markdown-style-guide.md](docs/markdown-style-guide.md).
* Follow the rules defined in [.markdownlint-cli2.jsonc](.markdownlint-cli2.jsonc).
* Use `*` for unordered list items (not `-` or `+`).
* Use 2-space indentation for nested lists.
* Leave 2 blank lines above headings and 1 blank line below.
* Do not use curly quotes or em dashes. The linter auto-corrects these.
* Inline HTML is restricted to `<br>`, `<pre>`, `<script>`, `<ul>`, `<li>`, and `<ol>`, plus the registered Vue component `<RepoCards>`.


## Banners

* The "Banners for important notes within docs" section in [docs/markdown-style-guide.md](docs/markdown-style-guide.md#banners-for-important-notes-within-docs) holds the banner rules, including what the title line may carry.


## Translation

* Refer to [docs/glossary.yaml](docs/glossary.yaml) for official translations.
* When writing new content, reference the glossary and then ensure the following guidelines are met:
  * Guidelines applicable to all content: [general-style-guide-english.md](docs/general-style-guide-english.md) and [general-style-guide-japanese.md](docs/general-style-guide-japanese.md)
  * Guidelines applicable to help documentation: [technical-style-guide-english.md](docs/technical-style-guide-english.md) and [technical-style-guide-japanese.md](docs/technical-style-guide-japanese.md)


## Bilingual synchronization

The `contents/en` and `contents/ja` trees are parallel: every page has a counterpart in the other language, aligned in structure, content, and meaning.

* Whenever you add, edit, move, rename, or delete a page in one tree, make the matching change in the other tree in the same commit.
* Update both locale blocks in `contents/.vitepress/config.mts` when a page is added, renamed, or removed, so the `nav` and `sidebar` entries stay parallel.
* Translate with [docs/glossary.yaml](docs/glossary.yaml), then polish with the `general-en-polisher` and `general-ja-polisher` skills.
* `pnpm check-en-ja-parity` verifies path parity and the sync-critical frontmatter fields, and runs as part of `pnpm check` and the PR build check workflow. It does not compare page content or meaning, so still confirm those by hand.
* Run `pnpm tree` after any change to the page set.


## Scripts

Helper scripts live in the top-level `scripts/` folder, and a skill may carry its own scripts under `skills/<skill-name>/scripts/`. See [scripts/README.md](scripts/README.md) for the index of the top-level scripts.

Authoring rules. The `script-auditor` skill enforces these, and `node skills/script-auditor/scripts/audit-helper-scripts.mjs` reports drift:

* Default to Node.js ES modules (`.mjs`) or zsh. Python is banned, because managing Python environments and dependencies across different users' machines is not worth the overhead.
* Use Node.js for file system operations, string manipulation, or integration with JavaScript-based tools, because it provides a consistent runtime and leverages the JavaScript ecosystem for build and automation tasks.
* Use zsh for simple command sequences, environment setup, or when leveraging powerful shell features that would be more cumbersome to implement in Node.js.
* Every script supports `--help` and prints usage that is clear to a user who has not seen the script before.
* Every script carries a notes section near the top covering general notes (what it does), usage (how to invoke it), output (what it returns or generates), and a reverse-chronological version history with a date and a summary per version.
* Bump the version and add a version-history entry whenever you change a script, and name the script and its new version in the commit title, for example `✨ generate-doc-structure.mjs v1.2.3: add new feature`.
* Use status emojis in output: ✅ for success, ⚠️ for warnings, and ❌ for errors.
* Do not split a sentence across a line break. When wrapping text, break only at sentence boundaries so each line contains whole sentences.

Permissions. `.claude/settings.json` sorts script invocations into three tiers by risk:

* `allow` for read-only scripts and scripts that write only their own generated file, such as `generate-doc-structure.mjs`, `lint-names.mjs`, `check-skill-allowlist.mjs`, and `index.sh`.
* `ask` for scripts that delete files or rewrite existing files in place, such as `cleanup-temp-files.sh` and `trim-png.mjs`.
* `deny` for destructive shell commands and for reads of local secret files such as `.env`.

When you add or rename a script, classify it into one of those tiers and add the matching entries: `Bash(<runner> <path>:*)` with the runner that matches how the script is invoked (`node` for a `.mjs` file, `zsh` for a shell script here), plus `Bash(pnpm <script>:*)` for every `package.json` script that invokes it. Prefix matching is literal, so an entry only fires on the exact command string it spells out.


## Code style

* Favor readability over cleverness in TypeScript, Vue, and Node.js code.
* Do not nest ternary operators. Use an early return or a named helper instead.


## Git commits

* Never add a Co-Authored-By trailer to commit messages.
* Follow the commit style guide in [docs/repo-commit-style-guide.md](docs/repo-commit-style-guide.md).
* Use the `ai-commit` skill to write commit messages based on git inputs and user notes.


## Package manager

Always use `pnpm` - never `npm`, `npx`, or `yarn`. The pnpm equivalents:

* `npm install` / `yarn add` → `pnpm add` (or `pnpm install` for the whole lockfile)
* `npm run <script>` / `yarn <script>` → `pnpm run <script>` (or `pnpm <script>`)
* `npm exec <bin>` → `pnpm exec <bin>`
* `npx <pkg>` → `pnpm dlx <pkg>`

Keep scripts in `package.json` sorted alphabetically.


## Continuous integration

* `.github/workflows/deploy.yml` builds the site with `pnpm vitepress-build` and deploys `contents/.vitepress/dist` to GitHub Pages on every push to `main`, and on manual dispatch. It passes `GITHUB_TOKEN` to raise the API rate limit for the Projects page data loader.
* `.github/workflows/pr-build-check.yml` runs the read-only gate on pull requests: naming rules, the contents tree snapshot, en/ja parity, the script tests, the typecheck, the license check, and a production build. It posts the results as a sticky comment on the pull request.
* `.github/workflows/pr-lint-autofix.yml` runs `pnpm lint` and `pnpm tree` on pull requests and commits the fixes back to the branch. It is skipped for pull requests from forks.
* `.github/workflows/sync-copilot-skills.yml` runs on every push to `main` that touches `skills/` and opens a pull request that copies each skill with a counterpart under `.github/skills/` over that counterpart, because GitHub Copilot does not support symlinks.
* `.github/workflows/vitepress-auto-update.yml` runs `pnpm vitepress-update` every Monday (and on manual dispatch) and opens a pull request when VitePress has a newer `@next` release.
* Dependabot (`.github/dependabot.yml`) opens weekly pull requests for npm dependencies, including VitePress, and monthly grouped pull requests for GitHub Actions.
* Pull request CI covers the same ground as `pnpm check` except formatting is fixed by the autofix workflow rather than gated. Still run `pnpm check` locally before you push.
