# GitHub Copilot instructions

[`AGENTS.md`](../AGENTS.md) at the repository root is the primary instruction set for every AI agent working here, Copilot included.
This file exists only because GitHub does not read `AGENTS.md`: it restates for Copilot the rules that `AGENTS.md` already states for everyone else, and it adds the review guidance that is specific to Copilot code review.
Read `AGENTS.md` first when you can, treat it as authoritative wherever the two disagree, and add a new rule there rather than here.

GitHub loads this file as the repository-wide custom instruction set, so it applies to code review and to authoring alike.
Path-scoped detail lives in `.github/instructions/*.instructions.md`, and GitHub applies a scoped file on top of this one when a changed file matches its `applyTo` pattern.


## Instruction files

* `.github/copilot-instructions.md`: this file, the repository-wide rules for review and authoring.
* `.github/instructions/english.instructions.md` and `.github/instructions/japanese.instructions.md`: language-specific writing guidance.
* `.github/instructions/vitepress.instructions.md`: the VitePress configuration and the custom theme.
* `.github/instructions/scripts.instructions.md`: helper scripts, skill scripts, and `package.json`.
* `.github/instructions/repo-indexes.instructions.md`: the skill and memory indexes and the permission allowlist.

A scoped file has to sit in `.github/instructions/`, has to be named `NAME.instructions.md`, and has to declare an `applyTo` glob, with commas between multiple globs.
A file that ends in any other suffix is ignored, so a rule placed there never reaches Copilot.
On GitHub.com the scoped files load for Copilot code review and the Copilot coding agent, so keep a rule in this file when it has to reach every surface.
When you add, rename, or remove a scoped file, update the list above.


## Review philosophy

* Report an issue only when you have high confidence that it is real and introduced or exposed by the pull request.
* Focus on correctness, user impact, security, broken content, and repository invariants.
* Make each comment actionable and keep one issue per comment.
* State the problem first, explain the impact when it is not obvious, and suggest a specific fix.
* Check the changed lines in their repository context before commenting.
* Do not repeat what an automated check already reports unless the failure reveals a problem that the author must reason about.
* Stay silent when you cannot identify a concrete issue.


## Sources of truth

Use these files in priority order when reviewing a change:

1. `AGENTS.md` for repository-wide requirements.
2. A matching `skills/<skill-name>/SKILL.md` for task-specific requirements.
3. The `.github/instructions/*.instructions.md` file whose `applyTo` glob matches the changed path.
4. `docs/markdown-style-guide.md` for Markdown formatting, plus the style guides and `glossary.yaml` under `docs/` for writing and translation rules.
5. `memory/MEMORY.md` and the memory file it indexes for the subject at hand, which hold the decisions and rendering gotchas that no style guide records.
6. Existing nearby files for local implementation patterns.

Do not treat this file as a replacement for those sources.
If two sources conflict, follow the higher-priority source.


## Repository context

* This repository is a personal portfolio site published at <https://ahandsel.github.io>.
* Site content lives in `contents/`, with English pages under `contents/en/` and Japanese pages under `contents/ja/`.
* The site uses VitePress and deploys to GitHub Pages on every push to `main`.
* Repository automation uses Node.js ES modules and zsh.
* Use `pnpm`, not `npm` or `yarn`.


## Writing style

No automated check enforces the rules in this section, and they apply to Markdown prose and to prose comments in scripts and other code files.

These come from `AGENTS.md`:

* Use straight quotes, not curly quotes.
* Do not use contractions (write "do not" instead of "don't").
* Use the Oxford comma.
* Use sentence case for headings (capitalize only the first word and proper nouns).
* Use a plain hyphen, never an en dash or an em dash.
* Do not split a single sentence across multiple source lines.
* Keep wording simple for non-native English speakers, and avoid slang and idioms.


## Code style

* Favor readability over cleverness in TypeScript, Vue, and Node.js code.
* Do not nest ternary operators. Use an early return or a named helper instead.


## Authoring rules

Apply these when writing or editing files rather than reviewing them:

* Use `lowercase-with-dashes` for all file and folder names.
* When renaming a file or folder, update every reference to it across documentation, scripts, and code.
* Keep each folder's `README.md` accurate when the folder's contents or purpose change.
* Use `*` for unordered list items, 2-space indentation for nested lists, 2 blank lines above headings, and 1 blank line below.
* Restrict inline HTML to `<br>`, `<pre>`, `<script>`, `<ul>`, `<li>`, and `<ol>`, plus the registered Vue component `<RepoCards>`.
* Keep the `scripts` block in `package.json` sorted alphabetically.


## Web research

These come from the "Web research" section of `AGENTS.md`, which stays authoritative.

* Before you read anything on the web, list the sites you want to check and wait for the user to approve the list.
* The rule covers every route to the network: the fetch and search tools, a browser session, a shell command such as `curl` or `wget`, and an MCP server that reads a remote resource for you.
* Approval covers the task at hand only, and a site the work turns up later needs its own ask.
* The standing allowlist of pre-approved sites lives in `.claude/settings.json` under `permissions.allow` as `WebFetch(domain:<host>)` entries. Read it before you ask, and leave an already-approved site out of the list you present.
* The rule is about reaching the network, not about running Node. Repository scripts and the allowlisted `gh` commands act on this repository, so they are not web research.


## Automated checks

* `.github/workflows/pr-build-check.yml` runs the read-only gate on pull requests: naming rules, the contents tree snapshot, en/ja parity, the script tests, the typecheck, the license check, and a production build.
* `.github/workflows/pr-lint-autofix.yml` runs `pnpm lint` and `pnpm tree` on non-fork pull requests and commits the fixes back to the branch.
* `.github/workflows/deploy.yml` runs `pnpm vitepress-build` and deploys to GitHub Pages on every push to `main` that is not limited to `.github/skills/`.
* `.github/workflows/sync-copilot-skills.yml` opens a pull request that copies each skill with a counterpart under `.github/skills/` over that counterpart on every push to `main` that touches `skills/`.
* `.github/workflows/vitepress-auto-update.yml` runs `pnpm vitepress-update` every Monday (and on manual dispatch) and opens a pull request when VitePress has a newer `@next` release.
* Dependabot opens weekly pull requests for npm dependencies other than VitePress, and monthly grouped pull requests for GitHub Actions, per `.github/dependabot.yml`. VitePress stays on the dedicated auto-update workflow.
* `pnpm check` runs the same gate locally, plus the formatting pass; run it before every push.

Because no automation compares page content between languages, review logic, links, and translations closely.


## Low-value comments to avoid

Do not comment on:

* Formatting that Prettier or markdownlint handles.
* Curly quotes, em dashes, en dashes, and non-breaking spaces, which the markdownlint `search-replace` rules in `.markdownlint-cli2.jsonc` rewrite automatically.
* Subjective rewrites that do not improve accuracy or task completion.
* Minor naming preferences when the existing name is clear and consistent.
* Requests for comments on self-explanatory code.
* Refactoring ideas without a concrete correctness or maintainability problem.
* Missing dependencies that a clean `pnpm install` or the workflow setup will detect.
* Several unrelated issues in one comment.


## Comment format

Use this structure when you identify an issue:

1. State the problem in one sentence.
2. Explain why it matters in one sentence when the impact is not obvious.
3. Suggest a specific change or a small replacement snippet.

Example:

```text
This rename breaks the relative link in `contents/en/about.md`, so the published page will 404. Update the link to the new path.
```
