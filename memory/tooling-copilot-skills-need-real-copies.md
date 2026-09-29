# Copilot skill folders must be real copies, not symlinks

* Type: Tooling
* Added: 2026-08-28
* Source: owner decision (2026-08-28 session); `.github/workflows/sync-copilot-skills.yml`

GitHub Copilot does not support symlinks, so each `.github/skills/<skill-name>` folder must hold a real copy of the matching `skills/<skill-name>` folder.
Never replace a copy with a symlink, even though a symlink looks like the cleaner way to prevent drift.

The folder under `skills/` stays canonical.
Edit the skill there only; `.github/workflows/sync-copilot-skills.yml` opens a pull request that copies each skill with a counterpart under `.github/skills/` over that counterpart on every push to `main` that touches `skills/`, so the copies never need a manual update.
Within a content pull request the copy can lag behind the canonical skill; it converges after the sync pull request merges, and that is accepted.
