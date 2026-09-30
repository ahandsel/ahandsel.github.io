# Prompts

Reusable AI prompt files (`*.prompt.md`) for reviewing, linting, and converting Markdown documentation, UX copy, and scripts in this repository. Each file defines a task-specific instruction set to run with an AI assistant.


## Usage

To use a prompt, reference the prompt's file path in the AI interface (VS Code extension, terminal prompt, or desktop app) with the appropriate prefix for the AI tool.

| Tool           | Input                                    | Example                                                 |
| -------------- | ---------------------------------------- | ------------------------------------------------------- |
| Claude         | `Follow prompts/<prompt-file>.prompt.md` | `Follow prompts/md-ref-link.prompt.md for example.md`   |
| Codex          | `Follow prompts/<prompt-file>.prompt.md` | `Follow prompts/md-ref-link.prompt.md for example.md`   |
| GitHub Copilot | `#prompts/<prompt-file>.prompt.md`       | `#prompts/script-version-sync.prompt.md for example.md` |


## Contents

| Prompt                             | Description                                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| [audit-broken-md.prompt.md][]      | Audit all Markdown files for character-substitution corruption and report without editing.       |
| [audit-code.prompt.md][]           | Audit a code file and produce a severity-ranked report on security, correctness, and tests.      |
| [audit-file-name.prompt.md][]      | Audit and propose renames for files and folders that violate the naming conventions.             |
| [audit-gh-workflow.prompt.md][]    | Audit a GitHub Actions workflow for correctness, security, and robustness, then propose fixes.   |
| [audit-memory-file.prompt.md][]    | Audit one memory file for accuracy, agent usability, and memory-index consistency.               |
| [audit-new-skill.prompt.md][]      | Audit the skills, scripts, and docs added in a commit and apply low-risk fixes.                  |
| [csv-lint.prompt.md][]             | Lint CSV files with minimal quoting and consistent formatting.                                   |
| [csv-to-md.prompt.md][]            | Convert CSV tables into Markdown tables.                                                         |
| [gh-pr-ready.prompt.md][]          | Diagnose why a branch or pull request is not ready to merge, then fix it after approval.         |
| [improve-my-prompt.prompt.md][]    | Rewrite a prompt with best practices and return it with a changelog and clarifying questions.    |
| [ja-review.prompt.md][]            | Proofread Japanese text for typos, grammar, notation consistency, and readability.               |
| [md-en-review.prompt.md][]         | Proofread and edit English text for clarity, grammar, and style guide compliance.                |
| [md-lint.prompt.md][]              | Scan Markdown files, update tables of contents, fix formatting, and enforce the style guide.     |
| [md-ref-link.prompt.md][]          | Convert inline Markdown links into reference-style links.                                        |
| [md-to-csv.prompt.md][]            | Convert Markdown tables into CSV.                                                                |
| [md-to-list.prompt.md][]           | Convert a Markdown table into a nested Markdown list without changing cell text or order.        |
| [md-to-slack.prompt.md][]          | Proofread a Markdown file and convert it into polished, Slack-ready formatting.                  |
| [prd-review-terms.prompt.md][]     | Extract and define terminology from a PRD document.                                              |
| [py-to-mjs-skill.prompt.md][]      | Port a skill's Python script to a Node.js ES module and verify it by running it.                 |
| [quick-en-review.prompt.md][]      | Quickly proofread and edit English text for clarity, grammar, and style.                         |
| [quick-ja-translation.prompt.md][] | Translate an English Markdown file into business Japanese, preserving meaning and tone.          |
| [repo-public-audit.prompt.md][]    | Audit a repository for personal, public use and flag terms or files that do not fit its purpose. |
| [script-review-min.prompt.md][]    | Review and improve a script with minimal, surgical edits.                                        |
| [script-review.prompt.md][]        | Review and improve a script for quality, readability, reusability, scalability, and security.    |
| [script-version-sync.prompt.md][]  | Auto-update changed scripts' version history and flag related documentation that is out of sync. |
| [setup-ja-font.prompt.md][]        | Set up a Japanese-friendly editor font so mixed-language Markdown tables align in VS Code.       |
| [skills-script-review.prompt.md][] | Review an AI agent skill and assess opportunities for Node.js script automation.                 |
| [slack-general-post.prompt.md][]   | Generate a short, consistently formatted Slack post from a task file, snippet, or notes.         |
| [ux-check-csv.prompt.md][]         | Proofread and edit UX copy in a CSV file.                                                        |
| [ux-check-md.prompt.md][]          | Proofread and edit UX copy in a Markdown table.                                                  |

[audit-broken-md.prompt.md]: audit-broken-md.prompt.md
[audit-code.prompt.md]: audit-code.prompt.md
[audit-file-name.prompt.md]: audit-file-name.prompt.md
[audit-gh-workflow.prompt.md]: audit-gh-workflow.prompt.md
[audit-memory-file.prompt.md]: audit-memory-file.prompt.md
[audit-new-skill.prompt.md]: audit-new-skill.prompt.md
[csv-lint.prompt.md]: csv-lint.prompt.md
[csv-to-md.prompt.md]: csv-to-md.prompt.md
[gh-pr-ready.prompt.md]: gh-pr-ready.prompt.md
[improve-my-prompt.prompt.md]: improve-my-prompt.prompt.md
[ja-review.prompt.md]: ja-review.prompt.md
[md-en-review.prompt.md]: md-en-review.prompt.md
[md-lint.prompt.md]: md-lint.prompt.md
[md-ref-link.prompt.md]: md-ref-link.prompt.md
[md-to-csv.prompt.md]: md-to-csv.prompt.md
[md-to-list.prompt.md]: md-to-list.prompt.md
[md-to-slack.prompt.md]: md-to-slack.prompt.md
[prd-review-terms.prompt.md]: prd-review-terms.prompt.md
[py-to-mjs-skill.prompt.md]: py-to-mjs-skill.prompt.md
[quick-en-review.prompt.md]: quick-en-review.prompt.md
[quick-ja-translation.prompt.md]: quick-ja-translation.prompt.md
[repo-public-audit.prompt.md]: repo-public-audit.prompt.md
[script-review-min.prompt.md]: script-review-min.prompt.md
[script-review.prompt.md]: script-review.prompt.md
[script-version-sync.prompt.md]: script-version-sync.prompt.md
[setup-ja-font.prompt.md]: setup-ja-font.prompt.md
[skills-script-review.prompt.md]: skills-script-review.prompt.md
[slack-general-post.prompt.md]: slack-general-post.prompt.md
[ux-check-csv.prompt.md]: ux-check-csv.prompt.md
[ux-check-md.prompt.md]: ux-check-md.prompt.md
