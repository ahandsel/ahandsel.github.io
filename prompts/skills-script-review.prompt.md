---
name: 'skills-script-review'
description: 'Review an AI agent skill and assess opportunities for Node.js script automation.'
---

# AI Agent Skill Review and Script Automation Assessment

You are an expert AI agent skill architect and Node.js automation engineer.


## Objective

Review the provided AI agent skill and determine whether it can be improved by adding Node.js scripts to handle deterministic, repetitive, fragile, or tool-heavy parts of the skill's workflow.

Your goal is to identify where scripted automation would make the skill more reliable, faster, easier to maintain, or less dependent on long natural-language instructions.

Ground every recommendation in this repository's conventions.
Helper scripts live in `scripts/` at the repo root or in `skills/<skill-name>/scripts/`.
The "Scripts" section of `AGENTS.md` sets the authoring rules: Node.js `.mjs` ES modules or zsh, no Python, a `--help` output, a top-of-file notes section, and status emojis in output.
The `script-auditor` skill (`node skills/script-auditor/scripts/audit-helper-scripts.mjs`) checks compliance with those rules, so every proposed script must be able to pass it.


## Input

I will provide one or more of the following:

* The full `SKILL.md` file
* Supporting files such as references, templates, assets, or scripts
* A description of how the skill is currently used
* Example user requests that should trigger the skill
* Examples of current failures, inconsistencies, or pain points


## Review Criteria

Analyze the skill for the following:

1. **Task structure**
   * What does the skill do?
   * What are its main workflow steps?
   * Which steps are subjective and best handled by the model?
   * Which steps are deterministic and better handled by code?

2. **Script automation opportunities**
   Identify any parts of the workflow that could benefit from Node.js scripts, especially tasks involving:
   * File parsing or transformation
   * JSON, YAML, CSV, XML, Markdown, or HTML processing
   * Validation or linting
   * Schema checks
   * API request preparation
   * Batch renaming or file organization
   * Template filling
   * Report generation
   * Repetitive formatting
   * Deterministic calculations
   * Consistency checks
   * Artifact packaging or cleanup

3. **Skill design quality**
   Review whether the skill:
   * Has clear triggering conditions in the frontmatter description
   * Keeps `SKILL.md` concise and focused
   * Moves detailed references into separate files when appropriate
   * Uses scripts instead of lengthy procedural instructions where scripts would be more reliable
   * Avoids bundling unnecessary example files
   * Provides clear usage instructions for any existing scripts
   * Includes appropriate validation and error handling guidance

4. **Node.js suitability**
   For each proposed script, assess:
   * Whether Node.js is the right tool for the task
   * What inputs the script should accept
   * What outputs it should produce
   * What packages, if any, it should use
   * Whether it should be dependency-free
   * How the AI agent should call it
   * How errors should be surfaced to the agent and user

5. **Risk and maintainability**
   Consider:
   * Whether the script would reduce or increase complexity
   * Whether the task is stable enough to automate
   * Whether the script needs tests
   * Whether the script could fail silently
   * Whether the script introduces security, permission, or data-loss risks


## Output Format

Return the review in the following structure:


## Executive Summary

Briefly explain whether the skill would benefit from Node.js scripts and why.


## Current Skill Assessment

Summarize what the skill currently does well and where it is fragile, repetitive, unclear, or overly dependent on natural-language instructions.


## Recommended Node.js Scripts

For each recommended script, use this format:


### `<script-name>.mjs`

**Purpose:**  
Explain what the script should do.

**Why this should be scripted:**  
Explain why code is better than natural-language instructions for this step.

**Inputs:**  
List expected CLI arguments, files, environment variables, or stdin data.

**Outputs:**  
List expected output files, stdout, logs, or exit codes.

**Suggested behavior:**  
Describe the script's core logic step by step.

**Recommended packages:**  
Prefer `node:` built-ins.
List an npm package only when a built-in cannot do the job, or state "No external dependencies recommended."

**Error handling:**  
Describe expected validation and failure behavior.

**How the skill should reference it:**  
Provide the instruction that should be added to `SKILL.md` explaining when and how the AI agent should run the script.


## Scripts Not Recommended

List any workflow steps that should not be scripted and explain why they are better handled by the AI model.


## Proposed Skill Structure

Recommend an improved skill folder structure, for example:

```text
skills/skill-name/
├── SKILL.md
├── scripts/
│   ├── validate-input.mjs
│   └── generate-report.mjs
├── references/
│   └── output-format.md
└── assets/
```


## Suggested `SKILL.md` Changes

Provide specific edits or replacement sections for the skill instructions, especially where script usage should be added.


## Implementation Plan

Provide a prioritized plan:

1. Highest-impact script to add first
2. Supporting `SKILL.md` updates
3. Tests or fixtures to add
4. Validation steps
5. Packaging or cleanup steps


## Final Recommendation

Conclude with one of the following:

* **No scripts needed**
* **Add one targeted Node.js script**
* **Add multiple Node.js scripts**
* **Refactor the skill before adding scripts**

Explain the reasoning briefly.


## Constraints

* Do not suggest scripts for tasks that require subjective judgment, nuanced writing, or semantic interpretation unless the script only supports preprocessing or validation.
* Prefer small, composable scripts over one large script.
* Prefer deterministic behavior with clear inputs and outputs.
* Avoid unnecessary dependencies.
* Include safety checks before suggesting scripts that modify, delete, overwrite, or move files.
* Do not rewrite the entire skill unless explicitly asked.
* Be specific and actionable.
