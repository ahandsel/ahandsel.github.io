# Tests

Automated tests for repository scripts and small shared modules, run with the Node built-in test runner (no extra dependencies):

```shell
pnpm test
```

`pnpm test` passes `--experimental-strip-types` so a test can import a `.ts` module from `contents/.vitepress/` when needed.

Most script tests are black-box CLI tests: each case spawns the real script with its `--root` flag pointing at a disposable fixture in a temp directory, and asserts the documented exit codes and diagnostics.

| File                                                       | Covers                                                                                       |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [helpers.mjs](helpers.mjs)                                 | Shared fixture and spawn helpers (`runScript`, `makeFixture`, `removeFixture`)               |
| [check-en-ja-parity.test.mjs](check-en-ja-parity.test.mjs) | `scripts/check-en-ja-parity.mjs`                                                             |
| [llms-pages.test.mjs](llms-pages.test.mjs)                 | `contents/.vitepress/llms-pages.ts` (`hasMarkdownTwin` and the ignore lists)                 |
| [sidebar-collapse.test.mjs](sidebar-collapse.test.mjs)     | Theme collapse and motion source contracts in `Layout.vue`, `style.css`, and `RepoCards.vue` |

`pnpm test` runs as part of `pnpm check` and in the PR build check workflow (`.github/workflows/pr-build-check.yml`).
When a new script gains a `--root` flag, add a matching `*.test.mjs` file here and reuse the helpers.
