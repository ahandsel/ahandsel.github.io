# Tests

Automated tests for the scripts in `scripts/`, run with the Node built-in test runner (no extra dependencies):

```shell
pnpm test
```

The tests are black-box CLI tests: each case spawns the real script with its `--root` flag pointing at a disposable fixture in a temp directory, and asserts the documented exit codes and diagnostics.

| File                                                       | Covers                                                                         |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [helpers.mjs](helpers.mjs)                                 | Shared fixture and spawn helpers (`runScript`, `makeFixture`, `removeFixture`) |
| [check-en-ja-parity.test.mjs](check-en-ja-parity.test.mjs) | `scripts/check-en-ja-parity.mjs`                                               |

`pnpm test` runs as part of `pnpm check` and in the PR build check workflow (`.github/workflows/pr-build-check.yml`).
When a new script gains a `--root` flag, add a matching `*.test.mjs` file here and reuse the helpers.
