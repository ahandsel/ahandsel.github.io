---
name: docs-sync-en-ja
description: Audit the `contents/en` and `contents/ja` trees for drift and bring them back to parity after pages change. Use when a user asks whether the English and Japanese pages are in sync, or after adding, editing, moving, renaming, or deleting files under `contents/`.
---

# Sync EN and JA docs

Keep the `contents/en` and `contents/ja` trees at **parity**: every page has a counterpart in the other language at the mirrored path, aligned in structure, content, and meaning.
This skill audits both trees for **drift**, then closes each gap.

For the translation itself, translate with [docs/glossary.yaml](../../docs/glossary.yaml) and the style guides in `docs/`, then polish with the `general-en-polisher` or `general-ja-polisher` skill.


## Scope

* In scope: pages (`.md`) under `contents/en` and `contents/ja`.
* Out of scope: `contents/index.md` (the root redirect stub, intentionally single-language), `contents/public/`, the config and theme under `contents/.vitepress/`, and any file the user names as intentionally single-language.
* Path mapping: `contents/en/<path>` pairs with `contents/ja/<path>`. The two paths differ only in the `en` / `ja` segment.


## Workflow

Follow these steps in order.


### Step 1: Find orphans and pairs

Start with the repo's parity check, which is the same check `pnpm check` and the PR build workflow run:

```bash
pnpm check-en-ja-parity
```

It lists every page that has no counterpart and every pair whose sync-critical frontmatter fields (`layout` and `isHome`) disagree.
Exit 0 means the trees are at parity, exit 1 means it found drift, and exit 2 means a configuration error (a missing locale tree or bad arguments).
The check walks the filesystem, so it sees new pages even before they are staged.

To inspect the file lists yourself, compare the two trees directly:

```bash
comm -3 \
  <(cd contents/en && find . -name '*.md' | sort) \
  <(cd contents/ja && find . -name '*.md' | sort)
```

Sort every file into one of three buckets:

* **EN orphan**: exists in `contents/en`, missing in `contents/ja`. Needs a JA counterpart created.
* **JA orphan**: exists in `contents/ja`, missing in `contents/en`. Either the EN source was deleted (remove the JA file) or the JA page is intentionally JA-only (confirm with the user).
* **Pair**: exists in both. Carry it to step 2.

Completion criterion: every `.md` in both trees is sorted into exactly one bucket.


### Step 2: Detect drift in each pair

A pair is **drifted** when the two files no longer match. Check all three kinds:

* **Content drift**: one file changed after its counterpart was last updated. Compare last-modified commits:

  ```bash
  en_time=$(git log -n 1 --format=%aI -- "$en_path")
  ja_time=$(git log -n 1 --format=%aI -- "$ja_path")
  ```

  If `en_time` is newer than `ja_time`, the JA page is likely stale, and the reverse holds too.
  Timestamps only flag a candidate; read the diff since the older side's commit to confirm real meaning drift.

* **Structural drift**: the heading count or heading hierarchy differs between the pair, regardless of timestamps.

* **Frontmatter drift**: the pair disagrees on `layout` or `isHome`. Most pages carry no frontmatter at all, which is itself a form of parity: if one side of a pair has frontmatter and the other does not, that is drift. The language-specific fields such as `title` and `description` are expected to differ.

`pnpm check-en-ja-parity` reports orphans and frontmatter mismatches, but not content or structural drift, so still check those by hand.

Record every drifted pair and which side is behind. A pair that is neither an orphan nor drifted is at parity; leave it untouched.

Completion criterion: every pair is marked either at parity or drifted with the stale side named.


### Step 3: Close each gap by direction

Work through orphans and drifted pairs. Pick the direction from what step 1 and step 2 found:

* **EN to JA** (the common case: EN orphan, or a pair whose JA side is stale): translate the EN content using [docs/glossary.yaml](../../docs/glossary.yaml), [docs/general-style-guide-japanese.md](../../docs/general-style-guide-japanese.md), and [docs/technical-style-guide-japanese.md](../../docs/technical-style-guide-japanese.md), then run the `general-ja-polisher` skill on the result.
* **JA to EN** (a pair whose EN side is stale): update the EN page to match the JA meaning and structure, following [docs/general-style-guide-english.md](../../docs/general-style-guide-english.md) and [docs/technical-style-guide-english.md](../../docs/technical-style-guide-english.md), then run the `general-en-polisher` skill. Keep code, commands, file paths, URLs, and identifiers unchanged.
* **Deletion** (JA orphan whose EN source was removed on purpose): delete the JA counterpart.

When a page is added, renamed, or removed, also update both locale blocks in `contents/.vitepress/config.mts` so the `nav` and `sidebar` entries stay parallel.

Never guess intent. When you cannot tell whether an orphan is a deletion or an intentional single-language page, stop and ask the user rather than creating or deleting a file.

Completion criterion: every orphan and drifted pair from steps 1 and 2 is resolved or explicitly deferred to the user.


### Step 4: Verify and report

Re-run `pnpm check-en-ja-parity` and confirm it reports parity, with no unexpected orphans and no frontmatter mismatches left.
Then report using this format:

```md
## Sync report

### Pairs at parity

- [count, or notable pairs]

### Gaps closed

- [file pair -> direction -> what changed]

### Needs your decision

- [orphans or ambiguities left for the user, with the question]
```


## After syncing

* Run `pnpm tree` and commit `docs/contents-structure.md` if you added, removed, renamed, or moved any page.
* Run `pnpm check` before committing.
