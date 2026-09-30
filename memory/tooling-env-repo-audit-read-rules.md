# .env.repo-audit is readable, but its contents stay private

* Type: Tooling
* Added: 2026-08-28
* Source: owner decision (2026-08-28 session); the permission rules in `.claude/settings.json`; migrated from the auto memory folder

`.env.repo-audit` holds the audit configuration that [prompts/repo-public-audit.prompt.md](../prompts/repo-public-audit.prompt.md) reads, and it is the one `.env*` file an agent may open in this repository.
`.claude/settings.json` denies `Read(.env)` and `Read(.env.local)`, and allows `Read(./**/.env.repo-audit)`, so the audit config opens without a permission prompt.
`.gitignore` excludes every `.env.*` file except `.env.example`, so the audit config never reaches the published repository.

Treat the contents as confidential even though the read is allowed.
Quote only the single value a task needs.
Never echo the whole file into a session summary, a pull request description, a commit message, or anywhere else a reader outside this machine can see it.
