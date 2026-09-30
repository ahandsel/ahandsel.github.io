// Black-box tests for contents/.vitepress/llms-pages.ts.
// Imports the real module through Node's type stripper so the theme gate and the plugin ignore list stay covered without a separate TypeScript runner.

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  LLM_IGNORED_PATTERNS,
  LLM_IGNORED_SOURCE_PAGES,
  hasMarkdownTwin,
} from '../contents/.vitepress/llms-pages.ts';

test('hasMarkdownTwin is true for English content pages that get a .md twin', () => {
  assert.equal(hasMarkdownTwin('en/about.md'), true);
  assert.equal(hasMarkdownTwin('en/projects.md'), true);
});

test('hasMarkdownTwin is false for ignored English pages', () => {
  assert.equal(hasMarkdownTwin('en/index.md'), false);
  assert.equal(hasMarkdownTwin('en/talks.md'), false);
});

test('hasMarkdownTwin is false for Japanese pages, the root redirect, and empty paths', () => {
  assert.equal(hasMarkdownTwin('ja/about.md'), false);
  assert.equal(hasMarkdownTwin('ja/index.md'), false);
  assert.equal(hasMarkdownTwin('index.md'), false);
  assert.equal(hasMarkdownTwin(''), false);
});

test('LLM_IGNORED_PATTERNS covers the source ignore list plus Japanese and README paths', () => {
  for (const page of LLM_IGNORED_SOURCE_PAGES) {
    assert.ok(LLM_IGNORED_PATTERNS.includes(page), `missing ${page}`);
  }
  assert.ok(LLM_IGNORED_PATTERNS.includes('ja/**'));
  assert.ok(LLM_IGNORED_PATTERNS.includes('**/README.md'));
});
