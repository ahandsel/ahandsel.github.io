#!/usr/bin/env node

// General notes:
//   Check that the contents/en and contents/ja trees stay in parity.
//   Every Markdown page must have a counterpart at the same relative path in the other language tree.
//   Paired pages must also agree on the sync-critical frontmatter fields listed in SYNC_FIELDS, because those fields control how VitePress renders the page.
//   Folder README.md files are internal documentation excluded from the build, so they are ignored here.
//
// Usage:
//   node scripts/check-en-ja-parity.mjs [--root <path>] [--help]
//   # or
//   pnpm check-en-ja-parity
//
//   Options:
//     --root <path>  Repository root to check (default: the parent of this script's folder; used by the tests).
//     -h, --help     Show the help message and exit.
//
// Output:
//   One ❌ line per missing counterpart or frontmatter mismatch, then a summary line.
//   Exit codes: 0 = trees in parity, 1 = drift found, 2 = configuration error.
//
// Version history:
//   * v1.0.0 - 2026-08-28 - Initial release.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const SCRIPT_VERSION = '1.0.0';

// Frontmatter fields that must match between a page and its counterpart.
// layout and isHome change the page shell, so a mismatch makes the two
// languages render differently.
const SYNC_FIELDS = ['layout', 'isHome'];

const LOCALES = ['en', 'ja'];

const HELP_TEXT = `check-en-ja-parity.mjs v${SCRIPT_VERSION}

Check that the contents/en and contents/ja trees stay in parity.
Every Markdown page must have a counterpart at the same relative path in the
other language tree, and paired pages must agree on the sync-critical
frontmatter fields: ${SYNC_FIELDS.join(', ')}.

Usage:
  node scripts/check-en-ja-parity.mjs [--root <path>] [--help]

Options:
  --root <path>  Repository root to check (default: the repository that holds
                 this script; the automated tests point it at fixtures).
  -h, --help     Show this help message and exit.

Exit codes:
  0  Trees are in parity.
  1  Drift found (missing counterpart or frontmatter mismatch).
  2  Configuration error (missing locale tree or bad arguments).
`;

function parseArgs(argv) {
  const args = { root: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '-h' || arg === '--help') {
      process.stdout.write(HELP_TEXT);
      process.exit(0);
    } else if (arg === '--root') {
      i += 1;
      if (argv[i] === undefined) {
        console.error('❌ --root requires a path argument.');
        process.exit(2);
      }
      args.root = argv[i];
    } else {
      console.error(`❌ Unknown option: ${arg}`);
      console.error('Run with --help for usage.');
      process.exit(2);
    }
  }
  return args;
}

// Recursively list Markdown files under dir, as paths relative to dir.
// README.md files are internal documentation, not published pages, so they
// are skipped.
function listMarkdownFiles(dir, prefix = '') {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(fullPath, relPath));
    } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
      files.push(relPath);
    }
  }
  return files.sort();
}

// Read the top-level scalar frontmatter fields of a Markdown file.
// Only zero-indent "key: value" lines inside the leading --- block are
// considered, which covers every field in SYNC_FIELDS without needing a full
// YAML parser.
function readFrontmatterFields(filePath) {
  const text = readFileSync(filePath, 'utf8');
  const lines = text.split('\n');
  if (lines[0] !== '---') return {};
  const fields = {};
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i] === '---') break;
    const match = /^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/.exec(lines[i]);
    if (match) {
      fields[match[1]] = match[2].trim();
    }
  }
  return fields;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const root = args.root ? path.resolve(args.root) : path.dirname(scriptDir);

  const localeDirs = {};
  for (const locale of LOCALES) {
    const dir = path.join(root, 'contents', locale);
    let isDirectory = false;
    try {
      isDirectory = statSync(dir).isDirectory();
    } catch {
      isDirectory = false;
    }
    if (!isDirectory) {
      console.error(`❌ Missing locale tree: ${path.join('contents', locale)}`);
      process.exit(2);
    }
    localeDirs[locale] = dir;
  }

  const [enDir, jaDir] = [localeDirs.en, localeDirs.ja];
  const enPages = listMarkdownFiles(enDir);
  const jaPages = listMarkdownFiles(jaDir);
  const enSet = new Set(enPages);
  const jaSet = new Set(jaPages);

  const problems = [];

  for (const page of enPages) {
    if (!jaSet.has(page)) {
      problems.push(`❌ contents/en/${page} has no counterpart at contents/ja/${page}`);
    }
  }
  for (const page of jaPages) {
    if (!enSet.has(page)) {
      problems.push(`❌ contents/ja/${page} has no counterpart at contents/en/${page}`);
    }
  }

  for (const page of enPages) {
    if (!jaSet.has(page)) continue;
    const enFields = readFrontmatterFields(path.join(enDir, page));
    const jaFields = readFrontmatterFields(path.join(jaDir, page));
    for (const field of SYNC_FIELDS) {
      const enValue = enFields[field];
      const jaValue = jaFields[field];
      if (enValue !== jaValue) {
        const shown = (value) => (value === undefined ? '(unset)' : JSON.stringify(value));
        problems.push(
          `❌ Frontmatter field "${field}" differs for ${page}: en=${shown(enValue)} ja=${shown(jaValue)}`,
        );
      }
    }
  }

  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(problem);
    }
    console.error(`❌ en/ja parity check failed with ${problems.length} problem(s).`);
    process.exit(1);
  }

  console.log(`✅ en/ja parity check passed for ${enPages.length} page pair(s).`);
}

main();
