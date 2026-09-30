// Black-box tests for scripts/check-en-ja-parity.mjs.
// Each case spawns the real script with --root pointing at a disposable fixture and asserts the documented exit codes and diagnostics.

import assert from 'node:assert/strict';
import test from 'node:test';

import { makeFixture, removeFixture, runScript } from './helpers.mjs';

const SCRIPT = 'scripts/check-en-ja-parity.mjs';

const HOME_PAGE = '---\nlayout: home\n---\n\n# Home\n';
const PLAIN_PAGE = '# Page\n\nBody text.\n';

function withFixture(pages, callback) {
  const root = makeFixture(pages);
  try {
    return callback(root);
  } finally {
    removeFixture(root);
  }
}

test('passes when both trees hold the same pages and frontmatter', () => {
  withFixture(
    {
      'en/index.md': HOME_PAGE,
      'en/about.md': PLAIN_PAGE,
      'ja/index.md': HOME_PAGE,
      'ja/about.md': PLAIN_PAGE,
    },
    (root) => {
      const result = runScript(SCRIPT, ['--root', root]);
      assert.equal(result.status, 0);
      assert.match(result.stdout, /✅/);
      assert.match(result.stdout, /2 page pair/);
    },
  );
});

test('fails when a page is missing from the ja tree', () => {
  withFixture(
    {
      'en/index.md': HOME_PAGE,
      'en/about.md': PLAIN_PAGE,
      'ja/index.md': HOME_PAGE,
    },
    (root) => {
      const result = runScript(SCRIPT, ['--root', root]);
      assert.equal(result.status, 1);
      assert.match(result.stderr, /contents\/en\/about\.md has no counterpart/);
    },
  );
});

test('fails when a page is missing from the en tree', () => {
  withFixture(
    {
      'en/index.md': HOME_PAGE,
      'ja/index.md': HOME_PAGE,
      'ja/extra.md': PLAIN_PAGE,
    },
    (root) => {
      const result = runScript(SCRIPT, ['--root', root]);
      assert.equal(result.status, 1);
      assert.match(result.stderr, /contents\/ja\/extra\.md has no counterpart/);
    },
  );
});

test('fails when a sync-critical frontmatter field differs', () => {
  withFixture(
    {
      'en/talks.md': '---\nlayout: home\nisHome: false\n---\n\n# Talks\n',
      'ja/talks.md': '---\nlayout: home\n---\n\n# Talks\n',
    },
    (root) => {
      const result = runScript(SCRIPT, ['--root', root]);
      assert.equal(result.status, 1);
      assert.match(result.stderr, /"isHome" differs for talks\.md/);
    },
  );
});

test('ignores README.md files, which are internal documentation', () => {
  withFixture(
    {
      'en/index.md': HOME_PAGE,
      'en/README.md': '# Internal notes\n',
      'ja/index.md': HOME_PAGE,
    },
    (root) => {
      const result = runScript(SCRIPT, ['--root', root]);
      assert.equal(result.status, 0);
    },
  );
});

test('checks pages in nested folders', () => {
  withFixture(
    {
      'en/index.md': HOME_PAGE,
      'en/guides/setup.md': PLAIN_PAGE,
      'ja/index.md': HOME_PAGE,
    },
    (root) => {
      const result = runScript(SCRIPT, ['--root', root]);
      assert.equal(result.status, 1);
      assert.match(result.stderr, /contents\/en\/guides\/setup\.md has no counterpart/);
    },
  );
});

test('exits with a configuration error when a locale tree is missing', () => {
  withFixture(
    {
      'en/index.md': HOME_PAGE,
    },
    (root) => {
      const result = runScript(SCRIPT, ['--root', root]);
      assert.equal(result.status, 2);
      assert.match(result.stderr, /Missing locale tree/);
    },
  );
});

test('prints usage and exits cleanly with --help', () => {
  const result = runScript(SCRIPT, ['--help']);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage:/);
  assert.match(result.stdout, /--root/);
});

test('rejects an unknown option with a configuration error', () => {
  const result = runScript(SCRIPT, ['--bogus']);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Unknown option/);
});
