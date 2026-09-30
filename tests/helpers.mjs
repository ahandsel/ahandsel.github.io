// Shared helpers for the script tests.
// runScript spawns a repository script as a child process, so every test exercises the real command line interface.
// makeFixture builds a disposable contents/ tree in a temp directory for the scripts that accept a --root flag.

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// Run a repository script with the current Node.js binary and return its exit status and captured output.
export function runScript(scriptRelPath, args = []) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, scriptRelPath), ...args], {
    encoding: 'utf8',
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

// Build a disposable repository root whose contents/ tree holds the given pages.
// The keys are paths relative to contents/, such as "en/about.md", and the values are the file contents.
export function makeFixture(pages) {
  const root = mkdtempSync(path.join(tmpdir(), 'ahandsel-test-'));
  for (const [relPath, content] of Object.entries(pages)) {
    const filePath = path.join(root, 'contents', relPath);
    mkdirSync(path.dirname(filePath), { recursive: true });
    writeFileSync(filePath, content);
  }
  return root;
}

export function removeFixture(root) {
  rmSync(root, { recursive: true, force: true });
}
