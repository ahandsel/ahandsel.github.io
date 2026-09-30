---
name: code-review
description: Audit a pull request in this repository against the merge gate and report the findings without editing anything. Use when reviewing a PR or a branch diff, and when checking English and Japanese parity, style-guide compliance, or index and allowlist drift on changed files.
---

# Code review

Audit a pull request against this repository's merge **gate**, then report what fails it.

The gate has two halves.
The automated half is `pnpm check` and the PR build check workflow, which cover formatting, the tests, the typecheck, naming, the license check, parity, the contents tree, and the build.
This skill owns the other half: whether each changed file is correct, consistent with the style guides, and complete with the index and config updates the change requires.

**Report only.**
Never edit a file, never commit, and never push.
Rewording reader-facing copy is the author's call, so hand back each finding with the exact fix rather than applying it.

Two rules hold for the whole run.

* **Evidence.** Every finding names a `path:line`, a command's output, or the row of a canonical source it contradicts. A finding you cannot cite is a suspicion, not a finding.
* **Canonical.** The sources named below hold the rules. Cite them instead of restating a rule from memory, and when a repo skill owns a domain, load that skill rather than re-deriving what it knows.


## Step 1: Establish the diff

Collect the complete list of changed paths.

```bash
PR=123 # the pull request number under review

gh auth status
gh pr diff "$PR" --name-only
gh pr view "$PR" --json title,body,files
```

Fall back to `git diff --name-only origin/main...HEAD` when `gh` is unavailable or unauthenticated.
With no shell at all, treat the changed files presented to you as the complete diff, and record in the report that every command gate below became an inspection.

Then read past the diff.
A page's counterpart in the other language, the `nav` and `sidebar` blocks in `contents/.vitepress/config.mts`, and the pages it links to all sit outside the changed hunks and all decide whether the change is correct.

Done when you hold the full list of changed paths and know whether a shell is available.


## Step 2: Run the automated gates

An unrun gate is not a pass.
Run each command from the repository root, or use the substitute and mark the gate unverified.

| Gate                             | Catches                                                                                                    | Without a shell                                                         |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `pnpm lint`                      | Prettier and markdownlint violations, including curly quotes, em and en dashes, and disallowed inline HTML | Scan the diff for those characters and for heading blank-line spacing   |
| `pnpm check-en-ja-parity`        | A page with no counterpart, and a pair disagreeing on the sync-critical frontmatter fields                 | Pair each changed page by path and compare `layout` and `isHome`        |
| `pnpm lint-naming`               | File and folder names that break the naming rules                                                          | Check new paths for kebab-case, `.yaml` over `.yml`, and `notes/` dates |
| `pnpm test-tree`                 | A stale `docs/contents-structure.md` after a page is added, removed, renamed, or moved                     | Confirm the PR commits a regenerated `docs/contents-structure.md`       |
| `pnpm test` and `pnpm typecheck` | Broken helper scripts, config, or theme code                                                               | Mark unverified                                                         |
| `pnpm license`                   | A dependency change that fails the license check                                                           | Mark unverified                                                         |
| `pnpm vitepress-build`           | Dead links, broken frontmatter, and anything else that fails the production build                          | Mark unverified                                                         |

`pnpm lint` writes files, so run it on a clean tree and read the resulting diff as the finding rather than committing it.

Done when every gate above has either run or been recorded as unverified.


## Step 3: Route every changed path

Send each changed path to the canonical source that governs it.

| Changed path                             | Canonical rules                                                                 | Load                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------- |
| `contents/en/**.md`, `contents/ja/**.md` | Step 4 below                                                                    | `general-en-polisher`, `general-ja-polisher` |
| A page added, moved, renamed, or deleted | The "Bilingual synchronization" and "Site URLs" sections of `AGENTS.md`         | `docs-sync-en-ja`                            |
| `contents/.vitepress/**`                 | The "VitePress" and "Site URLs" sections of `AGENTS.md`                         | -                                            |
| `scripts/**`, `skills/*/scripts/**`      | The "Scripts" section of `AGENTS.md`                                            | `script-auditor`                             |
| `skills/**`                              | The "Skills" section of `AGENTS.md`, and `skills/README.md`                     | `skill-allowlist-syncer`                     |
| `prompts/**`, `notes/**`, `docs/**`      | The folder's own `README.md` index, and the naming rules in `AGENTS.md`         | -                                            |
| `memory/**`                              | The maintenance rules in `memory/MEMORY.md`                                     | `prompts/audit-memory-file.prompt.md`        |
| `.github/**`                             | The "Continuous integration" and "Copilot instructions" sections of `AGENTS.md` | `prompts/audit-gh-workflow.prompt.md`        |
| Any changes                              | Readability, and no nested ternary operators                                    | `pr-auditor`                                 |
| A folder gaining or losing files         | The folder's own `README.md` (`memory/` is the exception and has none)          | `readme-maintainer`                          |

Open `memory/MEMORY.md` and read the memory files that touch the PR's subject.
They hold the styling and rendering calls that no style guide records.

Done when every changed path is routed, and any path you judge to need no review is named as such in the report.


## Step 4: Audit every changed page

Three passes over each changed page under `contents/`.


### Frontmatter

Most pages in this repository carry no frontmatter at all, and a matching absence on both sides of a pair is correct.
When a page does carry frontmatter, the sync-critical fields `layout` and `isHome` must match the counterpart page, which `pnpm check-en-ja-parity` verifies.
The language-specific fields such as `title` and `description` are expected to differ.
Each of these is a finding: a field set on one page of a pair but not the other, and frontmatter present on one side of a pair only.


### Bilingual parity

* The counterpart page exists at the mirrored path and says the same thing. The parity check confirms the path; only reading both pages confirms the meaning.
* A page added, renamed, or removed also updates both locale blocks in `contents/.vitepress/config.mts`, so the `nav` and `sidebar` entries stay parallel.
* A PR that adds new pages includes the published URL for each new page in its body, built from the rules in the "Site URLs" section of `AGENTS.md`.


### The checks no script covers

| Check                                                             | Canonical source                                                                     |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Wording, grammar, and word choice                                 | `docs/general-style-guide-english.md`, `docs/general-style-guide-japanese.md`        |
| Help-style content follows the technical guides                   | `docs/technical-style-guide-english.md`, `docs/technical-style-guide-japanese.md`    |
| Translated terms match the glossary                               | `docs/glossary.yaml`                                                                 |
| Markdown formatting, banners, and inline HTML limits              | `docs/markdown-style-guide.md`, and the "Markdown formatting" section of `AGENTS.md` |
| Alert title lines stay plain text                                 | `memory/styling-banner-title-plain-text.md`                                          |
| One sentence per source line                                      | `memory/styling-sentence-per-line.md`                                                |
| Table pipes re-padded by hand when a cell changes width           | `memory/styling-markdown-tables-need-manual-pipe-alignment.md`                       |
| No angle-bracket placeholders inside fenced `bash` blocks         | `memory/styling-prettier-sh-mangles-bash-fences.md`                                  |
| No TODO comment, placeholder, or template boilerplate in the body | The diff itself                                                                      |

Done when every changed page has a verdict on all three passes.


## Step 5: Verify every finding

Go back over the findings before you write any of them down.

The characteristic failure of an audit like this one is the plausible finding: a rule that sounds like this repository's but is written nowhere, or a violation of a rule the file is exempt from.
So for each finding, name its evidence: the line you read, the command output you saw, or the row of the canonical source it contradicts.
Drop what you cannot cite.
A short report of confirmed findings beats a long one padded with guesses.

Done when every surviving finding carries evidence, and you can say why each dropped one went.


## Step 6: Report the verdict

Order findings by severity, highest first.

* **Blocker.** CI fails, the build breaks, or the page ships something wrong to readers. A page with no counterpart, a broken link, a stale contents tree, or a skill missing from the allowlist.
* **Should fix.** A real deviation from a canonical source that does not break the build. Wording, formatting, a glossary mismatch, or a missing index entry.
* **Nit.** A preference with no canonical source behind it. Say so, and keep these few.

Give each finding its severity, a `path:line`, what is wrong, the canonical source, and the exact fix.
Then close with a summary table and one verdict.

| ID  | Severity | Location    | Problem | Fix |
| --- | -------- | ----------- | ------- | --- |
| F1  | ...      | `path:line` | ...     | ... |

* **Block merge** when any blocker stands.
* **Request changes** when no blocker stands but should-fix findings remain.
* **Approve** when only nits remain, or nothing does.

End with what you could not verify and why: a gate you had no shell for, or a pair whose meaning you could not compare because you do not read the language.
With no findings at all, say what you examined and why it passes, rather than inventing a finding to look thorough.
