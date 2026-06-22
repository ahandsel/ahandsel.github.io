# Repository rules

These rules apply to all AI agents working in this repository. This is the canonical instructions file.


## Project overview

This is a personal portfolio site built with [VitePress](https://vitepress.dev/). Site content lives in `contents/`, and the project includes documentation writing style guides, templates, terminology resources, and shared AI workflows from `skills/` and `agents/`.


## Repository structure

* `docs/` - Documentation writing style guides, templates, and EN-JA glossary
* `contents/` - VitePress site content and configuration
* `agents/` - Agent definitions
* `scripts/` - Development tools and automation scripts
* `skills/` - Reusable AI workflows, each with a `SKILL.md` file


### README.md

* Each folder should contain a `README.md` file that describes the contents and purpose of the folder. This helps maintain clarity and discoverability as the repository grows.
* Ensure that they are kept up to date with any changes to the folder's contents or purpose.


## Setup and commands

* `pnpm install` - Install dependencies.
* `pnpm lint` - Format code with Prettier and fix Markdown with markdownlint-cli2. Run before every commit and fix all reported errors.
* `pnpm contents-dev` - Start the VitePress dev server.
* `pnpm contents-build` - Build the site for production.
* `pnpm contents-preview` - Preview the production build locally.


## VitePress

This site is built with VitePress. For any VitePress-related question, configuration, customization, or troubleshooting, consult these official resources first:

* [VitePress documentation](https://vitepress.dev/) - official guides, configuration reference, and default theme API.
* [vuejs/vitepress on GitHub](https://github.com/vuejs/vitepress) - source code, issues, and release notes.


## Skills

Prioritize local skills in `skills/` over external or global skills.

1. Check [skills/README.md](skills/README.md) for the full index.
2. Load and follow `skills/<skill-name>/SKILL.md` before starting work.
3. If a local skill and an external skill overlap, use the local skill.


## File and folder naming

* Use `lowercase-with-dashes` for all file and folder names.
* When renaming a file or folder, update every reference to it across documentation, scripts, and code so that file paths and content remain accurate and consistent.


## Writing style

Apply these rules when reviewing or creating content:

* Use straight quotes, not curly quotes.
* Do not use contractions (write "do not" instead of "don't").
* Use the Oxford comma.
* Use sentence case for headings (capitalize only the first word and proper nouns).
* Never use en-dash or em-dash; always use a plain hyphen (`-`) instead.
* Do not split a single sentence across multiple lines.
* Keep wording simple for non-native English speakers. Avoid slang and idioms.
* Maintain consistent capitalization and punctuation throughout a document.


## Markdown formatting

* When writing or editing any Markdown file, follow [docs/markdown-style-guide.md](docs/markdown-style-guide.md).
* Follow the rules defined in [.markdownlint-cli2.jsonc](.markdownlint-cli2.jsonc).
* Use `*` for unordered list items (not `-` or `+`).
* Use 2-space indentation for nested lists.
* Leave 2 blank lines above headings and 1 blank line below.
* Do not use curly quotes or em dashes. The linter auto-corrects these.
* Inline HTML is restricted to `<br>`, `<pre>`, `<script>`, `<ul>`, `<li>`, and `<ol>`.


## Translation

* Refer to [docs/glossary.yaml](docs/glossary.yaml) for official translations.
* When writing new content, reference the glossary and then ensure the following guidelines are met:
  * Guidelines applicable to all content: [general-style-guide-english.md](docs/general-style-guide-english.md) and [general-style-guide-japanese.md](docs/general-style-guide-japanese.md)
  * Guidelines applicable to help documentation: [technical-style-guide-english.md](docs/technical-style-guide-english.md) and [technical-style-guide-japanese.md](docs/technical-style-guide-japanese.md)


## Scripts

Default to creating scripts as Node.js ES modules (`.mjs`) or zsh for any new script tooling in this repo.

* Do not use Python due to the overhead of managing Python environments and dependencies across different users' machines.
* Default to Node.js for scripts that involve file system operations, string manipulation, or integration with JavaScript-based tools, as it provides a consistent runtime environment and leverages the strengths of the JavaScript ecosystem for build and automation tasks.
* Use zsh for simple command sequences, environment setup, or when leveraging powerful shell features that would be more cumbersome to implement in Node.js.
* Always include `--help` output for any script, and ensure it is clear and informative for users who may not be familiar with the script's functionality.
* When writing scripts, always include a notes section near the top with:
  * General notes - a brief description of what the script does.
  * Usage - how to include or invoke the script.
  * Output - what the script generates or returns.
* For script outputs that are expected to be read by a user, use emojis to clarify messages and statuses, e.g. ✅ for success, ⚠️ for warnings, and ❌ for errors.


## Package manager

Always use `pnpm` - never `npm`, `npx`, or `yarn`. The pnpm equivalents:

* `npm install` / `yarn add` → `pnpm add` (or `pnpm install` for the whole lockfile)
* `npm run <script>` / `yarn <script>` → `pnpm run <script>` (or `pnpm <script>`)
* `npm exec <bin>` → `pnpm exec <bin>`
* `npx <pkg>` → `pnpm dlx <pkg>`

Keep scripts in `package.json` sorted alphabetically.
