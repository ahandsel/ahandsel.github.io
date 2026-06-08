// generate-doc-structure.mjs notes
// Usage:
//   node scripts/generate-doc-structure.mjs
//
// Output:
//   doc-structure.md at the repository root.
//
// Description:
// * Purpose: Generates a snapshot of defined folders in a tree view and saves it as a Markdown file.
// * Goal: Visualize the structure of defined folders to help contributors understand the overall structure.
// * Add files or folders to foldersToScan to include them in the output. Each entry can specify extra tree-extended filter args for customization.
// * Add files to filesToIgnore to exclude them from the output.
//
// Version history:
// v2.0.1 (2026-03-23): Enabled multiple folder scanning with section headings, added filtering of ignored files, and improved error handling for missing folders. Updated output formatting for cleaner Markdown presentation.

import { execFileSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve repository root from this script location.
const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

// Folders to scan. Each entry can specify extra tree-extended args.
const foldersToScan = [{ path: '.' }];
// const foldersToScan = [
//   { path: 'contents', args: ['-only=0:(en|ja|snippets|public)$'] },
//   { path: 'skills', args: ['-only=1:SKILL.md'] },
// ];

// Entries to ignore in the generated doc structure.
const filesToIgnore = new Set(['temp.md', '.DS_Store']);

// Write a generated tree snapshot into the repo root.
const outputPath = resolve(repoRoot, 'doc-structure.md');

// Remove trailing empty lines from a string.
function trimTrailingEmptyLines(str) {
  return str.replace(/\n+$/, '');
}

// Filter lines that contain any ignored file name.
function filterIgnored(raw) {
  if (!raw) return '';
  const lines = raw.split('\n');
  const kept = lines.filter(
    (line) => ![...filesToIgnore].some((entry) => line.includes(entry)),
  );
  return kept.join('\n');
}

const sections = [];

for (const folder of foldersToScan) {
  const folderPath = resolve(repoRoot, folder.path);
  if (!existsSync(folderPath)) {
    console.warn(
      'Warning: %s not found at %s — skipping.',
      folder.path,
      folderPath,
    );
    continue;
  }

  const args = [
    folder.path,
    '-gitignore',
    ...(folder.args || []),
    '-charset=utf8-icons',
  ];

  try {
    const raw = execFileSync('tree-extended', args, {
      cwd: repoRoot,
      encoding: 'utf8',
    });
    const filtered = filterIgnored(raw);
    if (filtered) {
      const codeBlock = `\`\`\`txt\n${trimTrailingEmptyLines(filtered)}\n\`\`\``;
      const section =
        foldersToScan.length > 1
          ? `\n## ${folder.path}\n\n${codeBlock}`
          : codeBlock;
      sections.push(section);
    }
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      console.error(
        'Error: missing dependency!\ntree-extended not found. Please install all dependencies or add tree-extended to dependencies.\n\nPotential solutions:\npnpm install\nor\npnpm add -D tree-extended\n',
      );
      process.exit(1);
    }
    console.error(
      'Failed to run tree-extended for %s. Install dependencies with "pnpm install" and ensure tree-extended is available in PATH.',
      folder.path,
    );
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }
}

const output = sections.join('\n\n');

if (sections.length === 0) {
  console.warn('Warning: no folder output was generated. Skipping file write.');
  process.exit(0);
}

// Save the tree output as a Markdown file.
writeFileSync(outputPath, `# Doc structure\n\n${output}\n`, 'utf8');
console.log('Wrote %s (%d sections).', outputPath, sections.length);
