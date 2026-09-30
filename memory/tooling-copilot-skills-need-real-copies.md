# Copilot skill folders must be real copies, not symlinks

* Type: Tooling
* Added: 2026-08-28
* Source: owner decision (2026-08-28 session); `.github/workflows/sync-copilot-skills.yml`

GitHub Copilot does not support symlinks, so each `.github/skills/<skill-name>` folder must hold a real copy of the matching `skills/<skill-name>` folder.
Never replace a copy with a symlink, even though a symlink looks like the cleaner way to prevent drift.

The folder under `skills/` stays canonical.
Every skill under `skills/` must already have a seeded counterpart under `.github/skills/`; when you add a skill, add that copy in the same change.
The sync workflow only refreshes counterparts that already exist, so it cannot create a missing copy on its own.
Edit the skill under `skills/` only; `.github/workflows/sync-copilot-skills.yml` opens a pull request that copies each seeded counterpart from `skills/` on every push to `main` that touches `skills/`.
Within a content pull request the copy can lag behind the canonical skill; it converges after the sync pull request merges, and that is accepted.
That sync pull request is opened with `GITHUB_TOKEN`, so GitHub does not start `pr-build-check` on it; run `pnpm check` locally (or otherwise re-trigger CI) before merging.

Relative links inside a skill are written for the `skills/<name>/` depth.
The mirror under `.github/skills/<name>/` sits one directory deeper, so those same relative links do not resolve there.
`.markdownlint-cli2.jsonc` therefore ignores `.github/skills/**` and lints the canonical `skills/` tree only.
