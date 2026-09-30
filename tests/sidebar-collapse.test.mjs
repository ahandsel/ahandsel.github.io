// Contract tests for the collapsible sidebar and home motion rules.
// These assert source invariants the PR auditor caught: rem breakpoints that
// match VitePress, a zeroed nav column offset while collapsed, LocalNav Menu
// clearing collapse, backwards fill mode for hover-compatible entrances, and
// reduced-motion opt-outs. They do not drive a browser.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const styleCss = readFileSync(
  resolve(repoRoot, 'contents/.vitepress/theme/style.css'),
  'utf8',
);
const layoutVue = readFileSync(
  resolve(repoRoot, 'contents/.vitepress/theme/Layout.vue'),
  'utf8',
);
const repoCardsVue = readFileSync(
  resolve(repoRoot, 'contents/.vitepress/theme/RepoCards.vue'),
  'utf8',
);

test('collapse breakpoints use VitePress rem values, not raw pixels', () => {
  const collapseStart = styleCss.indexOf('Component: Collapsible sidebar');
  assert.ok(collapseStart >= 0, 'missing collapsible sidebar section');
  const collapseCss = styleCss.slice(collapseStart);

  assert.match(collapseCss, /@media \(min-width: 60rem\)/);
  assert.match(collapseCss, /@media \(min-width: 90rem\)/);
  assert.match(collapseCss, /@media \(width < 60rem\)/);
  assert.doesNotMatch(collapseCss, /@media \(min-width: 960px\)/);
  assert.doesNotMatch(collapseCss, /@media \(min-width: 1440px\)/);
  assert.doesNotMatch(collapseCss, /@media \(max-width: 959px\)/);
});

test('collapsed nav resets --vp-nav-col-offset so the title keeps a background', () => {
  assert.match(
    styleCss,
    /html\.sidebar-collapsed\s+\.VPNavBar\.has-sidebar\s*\{[^}]*--vp-nav-col-offset:\s*0;/s,
  );
});

test('Layout clears collapse when LocalNav Menu is clicked', () => {
  assert.match(layoutVue, /onLocalNavMenuClick/);
  assert.match(layoutVue, /\.VPLocalNav\s+\.menu/);
  assert.match(layoutVue, /collapsed\.value = false/);
  assert.match(layoutVue, /addEventListener\('click',\s*onLocalNavMenuClick,\s*true\)/);
  assert.match(
    layoutVue,
    /removeEventListener\('click',\s*onLocalNavMenuClick,\s*true\)/,
  );
});

test('entrance animations use backwards fill so hover transforms still apply', () => {
  assert.match(styleCss, /animation:\s*fade-in-up[^;]*backwards/);
  assert.match(repoCardsVue, /animation:\s*fade-in-up[^;]*backwards/);
  assert.doesNotMatch(styleCss, /animation:\s*fade-in-up[^;]*\bboth\b/);
  assert.doesNotMatch(repoCardsVue, /animation:\s*fade-in-up[^;]*\bboth\b/);
});

test('new motion is disabled under prefers-reduced-motion', () => {
  assert.match(
    styleCss,
    /@media \(prefers-reduced-motion: reduce\)\s*\{[^}]*\.VPHero \.name,/s,
  );
  assert.match(
    styleCss,
    /@media \(prefers-reduced-motion: reduce\)\s*\{[^}]*\.VPFeatures \.VPFeature/s,
  );
  assert.match(
    repoCardsVue,
    /@media \(prefers-reduced-motion: reduce\)\s*\{[^}]*\.repo-card/s,
  );
});
