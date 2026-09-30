---
applyTo: 'scripts/**,skills/*/scripts/**,package.json'
---

# Scripts and repository automation

`AGENTS.md` sets the authoring rules for helper scripts, and `skills/script-auditor/SKILL.md` enforces them.
No workflow runs these scripts automatically, so every script here reaches use on review alone.

* New helper scripts use Node.js ES modules (`.mjs`) or zsh by default.
  Python is not allowed.
* Every helper script supports `--help` and has a top-of-file notes section that documents its general notes, usage, and output.
* Script output uses `✅` for success, `⚠️` for warnings, and `❌` for errors.
* Script documentation in the relevant `README.md` remains accurate.
* A new or renamed script has matching permission entries in `.claude/settings.json`, including each `pnpm` wrapper, and is assigned to the correct `allow`, `ask`, or `deny` tier.
* New subprocess calls handle nonzero exits and do not interpolate untrusted input into shell commands.
* New file operations validate their target and cannot delete or overwrite a broad directory accidentally.
* Scripts in `package.json` remain alphabetically sorted and use `pnpm` for package-manager commands.
