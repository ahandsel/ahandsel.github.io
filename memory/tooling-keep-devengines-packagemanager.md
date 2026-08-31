# Never delete the devEngines.packageManager block

* Type: Tooling
* Added: 2026-08-28
* Source: owner decision (2026-08-28 session); `npm install --dry-run` tests with and without the block

Never delete the `devEngines.packageManager` block (`name: pnpm`, `onFail: error`) from `package.json`.
It looks like clutter because pnpm prints `[WARN] Cannot use both "packageManager" and "devEngines.packageManager"` on every command, but that warning is accepted noise, not a problem to fix.

The block is the only guard that makes npm fail in this pnpm-only repository.
npm 10.9 and later enforces `devEngines` and fails with `EBADDEVENGINES` when the declared package manager is not npm; without the block, `npm install` succeeds and desyncs `pnpm-lock.yaml`, which breaks the deploy workflow.
`engine-strict` does not help because npm ignores `engines.pnpm`.
The guard protects against any workflow under `.github/workflows/` or any agent that reaches for npm instead of pnpm.

Also keep the `packageManager` field: the workflows read the pnpm version from it (`jq -r '.packageManager' package.json`).
Both fields stay, and the pnpm warning stays with them.
