---
name: 'py-to-mjs-skill'
description: "Port a skill's Python (.py) script to a behavior-faithful Node.js ES module (.mjs) that follows the repo AGENTS.md script rules, update SKILL.md and all references, then verify the result by running it."
---

# Port a skill's Python script to a Node.js ES module


## Objective

Given a skill folder at `skills/<skill-name>/` containing a Python (`.py`) script, replace that script with a Node.js ES module (`.mjs`) that follows the repo [AGENTS.md][] guidelines.
The port must reproduce the original script's behavior exactly.
Then prove the result works by exercising it, not by reading it.


## Role

You are a careful tooling engineer.
You port scripts without changing their behavior, match the existing house style precisely, and trust only what you have observed running, never what the code appears to do.


## Inputs

* The skill folder path: `skills/<skill-name>/`.
* If the folder is not given, ask for it before starting.
  Do not guess.


## Conversion requirements

1. **Establish the contract first.**
   Read the skill's `SKILL.md` and the existing `.py` script.
   List every flag, default value, guardrail, refusal, exit code, and side effect.
   The new `.mjs` script must be a faithful, behavior-for-behavior port.
   Do not add, remove, or "improve" any feature.

2. **Match the house style.**
   Study existing `.mjs` scripts (`skills/*/scripts/*.mjs`) and follow the AGENTS.md "Scripts" rules exactly:
   * Node.js ES module.
     No Python.
     No dependencies beyond `node:` built-ins.
   * Target the Node.js version required by the `engines` field in the repo `package.json`.
     Newer built-ins (for example, `node:util` `parseArgs`) are acceptable when that version supports them; confirm the version before relying on them.
   * Use `spawnSync` without a shell, so arguments pass as argv and are never interpolated into a shell string.
   * Provide `--help` and `-h` flags with clear usage, options, and exit codes.
   * Include a top-of-file notes block with these sections: General notes, Usage, Options, Output, and a reverse-chronological Version history (`vX.Y - YYYY-MM-DD - summary`).
   * Use status emojis in user-facing output: a check mark for success, a warning sign for warnings or refusals, and a cross mark for errors.
   * Name the file in kebab-case.
     Keep the original filename stem (changing only the extension) when it is already clear.
     If the original name is unclear, rename it to a clearer kebab-case verb phrase (for example, `do-the-thing.mjs`), and note the rename in the report.
     Never use snake_case.
   * Preserve every original exit code, including signal termination (`status === null`) and propagation of the underlying tool's own exit codes.

3. **Remove the old script and update references.**
   Delete the `.py` script with `git rm`.
   Update `SKILL.md` so every invocation calls `node ".../<script>.mjs"` in place of `python3 .../<script>.py`.
   Grep the entire repo for any remaining reference to the old script name or `.py` path and update each one, or confirm none remain.
   A mention inside the new script's version-history note is acceptable.

4. **Apply the core writing rules** to any `SKILL.md` text you touch: straight quotes, no contractions, the Oxford comma, plain hyphens (never an en-dash or em-dash), sentence case headings, and no sentence split across a line break.
   Then run `pnpm lint` (or `markdownlint-cli2` on the changed files) and fix every issue it reports.


## Verification

1. **Exercise the script; do not just read it.**
   Build a throwaway sandbox (for example, a temporary git repo or fixture directory) and test the real behavior end to end:
   * the happy path,
   * every flag,
   * each guardrail and refusal,
   * invalid-argument handling,
   * `--help`,
   * and the most important failure mode the script claims to handle.

   Confirm that the exit code in each case matches the `SKILL.md` contract.

2. **Report honestly.**
   Present results as a table with columns: Scenario, Result, Exit code.
   Call out any nuance or wrinkle.
   State plainly whether the skill is reliable.
   If you find a gap between what `SKILL.md` promises and what the script (or the underlying tool) actually does, report it and propose either a documentation clarification or a code fix, but do not apply the fix in this pass.
   Leave the decision to the user.
   Never paper over a gap silently.


## Output

Produce all of the following:

1. The new `.mjs` script.
2. The deleted `.py` script (staged with `git rm`).
3. An updated `SKILL.md` and any other updated references.
4. A verification report containing the results table from the Verification section, plus any filename rename and any behavior gaps you found.

Do not commit.
Stop and present the changes for review when done.

[AGENTS.md]: ../AGENTS.md
