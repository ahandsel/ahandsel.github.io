---
name: 'audit-memory-file'
description: 'Audit and improve one repository memory file for accuracy, agent usability, source quality, and memory-index consistency.'
---

# Audit a memory file


## Role

You maintain durable repository memories used by Claude Code, Codex, and other coding agents.
Make each memory accurate, necessary, concise, actionable, and safe to follow without prior conversation context.


## Task

Audit the memory file path I provide and determine whether to:

1. **Update it** - The memory is necessary, but low-risk corrections would make it accurate or easier for agents to apply.
2. **Keep it unchanged** - The memory is necessary and already meets the repository requirements.
3. **Propose a rename** - The memory is necessary, but its filename violates the current memory naming rules.
4. **Propose deletion** - The memory is obsolete, unnecessary, or fully replaced by an authoritative source.

Apply low-risk content fixes directly to the target file for outcome 1.
Do not rename or delete a file without my confirmation.


## Input and scope

The input must be one Markdown file under `memory/`, excluding `memory/MEMORY.md`.
Audit the current file on disk, including uncommitted changes.
If the path is missing, ambiguous, outside `memory/`, or does not exist, stop and ask for a valid path.

Edit only the target memory file.
Report required changes to `memory/MEMORY.md` or authoritative source files, but do not edit them.
Preserve all unrelated working-tree changes.


## Required evidence

Before reaching a verdict:

1. Read the target file in full.
2. Read `AGENTS.md` and `memory/MEMORY.md` in full.
3. Read each available repository source cited by the target's `Source` item.
4. Read directly related memories only when needed to check overlap, conflicts, or linked decisions.
5. Search the repository for the memory's central rule, term, UI label, or claim to find newer authority, conflicting usage, or relevant scope.
6. Check the target and related files in the current working tree, not only their committed versions.
7. Load and follow any repository skill that `AGENTS.md` requires for this task. Prefer repository skills over global skills.

Treat repository evidence as authoritative in the order defined by `memory/MEMORY.md` and `AGENTS.md`.
Do not rely on prior conversation context, general product knowledge, or the filename as evidence.
If an external source is unavailable, verify only what the repository evidence supports and report the remaining uncertainty.


## Audit criteria


### 1. Eligibility and freshness

Confirm that the file records one non-obvious fact, decision, or open question that future agents need.
The memory must supplement authoritative repository sources rather than repeat `AGENTS.md`, a style guide, current documentation, or git history.

Choose outcome 3 or 4 when:

* An authoritative source now contains the complete rule or fact.
* The memory is obsolete, contradicted, or no longer useful.
* The file combines unrelated subjects that require separate memories.
* The filename requires a rename under the current memory naming rules.
* The filename prefix does not match the memory's correct type, so the file needs an `auditing-`, `styling-`, `tooling-`, or `wording-` rename.

Do not rewrite an unnecessary memory merely to make it read better.


### 2. Required structure

Confirm that the file has:

* One H1 title that states the fact, decision, or open question directly.
* `Type`, `Added`, and `Source` list items immediately after the title.
* A `Type` set to exactly one of the four allowed memory types, written in title case:
  * `Auditing` - instructions for agents that review or verify content.
  * `Styling` - decisions about how to write or format repository content.
  * `Tooling` - decisions about repository configuration, automation, and developer tooling.
  * `Wording` - terminology choices and guidance about how to phrase repository content.
* An ISO 8601 date in `Added`, such as `2026-08-19`.
* A specific `Source` that names the relevant file, section, ticket, pull request, prompt, or other authoritative location.
* A kebab-case filename whose category prefix is the lowercase form of the `Type` value: `auditing-`, `styling-`, `tooling-`, or `wording-`.
* Relative Markdown links to repository files and related memories.

When the subject fits more than one type, choose the type that describes the action the memory asks an agent to take, and report the alternative as a related finding.
Ask the user if a new `Type` value is required if the memory does not fall under the existing types.

Do not invent metadata.
Use repository or git evidence to correct metadata only when the evidence is conclusive.
If an `Added` date or source cannot be verified, leave the uncertain value unchanged and report it as an open question.


### 3. Accuracy and authority

Verify every operational claim against the cited source and current repository state.

* Narrow broad claims to the scope supported by evidence.
* Do not promote an example into a universal rule.
* Preserve unresolved issues as open questions.
* Distinguish a confirmed decision from a convention inferred from current usage.
* Prefer exact file names, UI labels, keys, commands, and conditions over summaries when exactness affects agent behavior.
* Remove or correct claims that conflict with newer authoritative evidence.

Do not edit an authoritative source merely to make the memory true.


### 4. Agent usability

Optimize the memory for fast and consistent application by coding agents:

* Put the action, decision, or unresolved question before its rationale.
* Use direct verbs, concrete nouns, and testable conditions.
* Define scope, exceptions, and prerequisites when they affect the result.
* Distinguish mandatory rules from preferences.
* Name prohibited alternatives when the decision rejects specific wording or behavior.
* Include singular, plural, or other grammatical forms when omission could cause inconsistent application.
* Replace vague phrases such as "when possible", "actual output", "the system", and "related content" with precise conditions.
* Retain only rationale that helps an agent apply the memory correctly.
* Remove repetition and background available from the cited source.

Keep the body short enough to scan quickly.
Do not add a heading for one sentence of content.


### 5. Index consistency

Check whether `memory/MEMORY.md` has:

* One contents entry for the target file.
* A valid relative link.
* Link text and a description that match the target's current meaning.
* No duplicate, obsolete, or conflicting entry for the same subject.

Report the exact index change needed when the index is inconsistent.
Do not edit the index unless it is explicitly in scope.


## Editing rules

For outcome 1, apply the smallest evidence-backed change that resolves each confirmed issue.
Low-risk edits include:

* Clarifying supported scope or conditions.
* Replacing ambiguous or repetitive wording.
* Correcting facts or metadata when authoritative evidence is conclusive.
* Correcting a `Type` value to the allowed type that matches the memory's subject, then reporting the matching filename rename when the prefix no longer agrees.
* Adding explicit prohibited forms or exceptions already established by the source.
* Repairing a relative link without changing its intended destination.

Do not:

* Add unsupported facts, rules, exceptions, or rationale.
* Change an open question into a decision.
* Rename, split, merge, or delete memory files.
* Expand the edit into related memory, index, documentation, or source files.
* Reformat unrelated text for cosmetic consistency.

For outcomes 3 and 4, leave the target unchanged and provide the exact proposed rename or deletion and its required index update.


## Verification

After deciding or editing:

1. Re-read the complete target file from disk.
2. Confirm that each local source path and relative Markdown link resolves.
3. Search for outdated wording that the edit was meant to remove.
4. Run the repository's formatter and Markdown lint check against the target file only.
5. Confirm that no file outside the allowed scope changed because of this audit.
6. Re-evaluate the outcome against all five audit criteria.

Do not run a whole-repository formatter for a single-memory audit.
If a verification step cannot run or fails for an unrelated reason, report the command and reason precisely.


## Output format

Return a concise report in this order:

1. **Outcome** - `Updated`, `No change needed`, `Rename proposed`, or `Deletion proposed`, followed by a one-sentence rationale.
2. **Changes made** - Material edits and why they improve accuracy or agent use. Omit this section when the file was not edited.
3. **Related findings** - Exact index drift, source conflicts, duplication, or out-of-scope changes needed. Omit this section when there are none.
4. **Verification** - Checks run and their results.
5. **Open questions** - Only uncertainties that repository evidence could not resolve. Omit this section when there are none.

For a proposed rename or deletion, end by asking for confirmation before applying it.


## Repository writing constraints

* Use plain hyphens, never en dashes or em dashes.
* Use straight quotes.
* Do not use contractions.
* Keep each sentence on one source line.
* Follow the Markdown conventions in `AGENTS.md`.
* Do not manufacture findings to justify an edit.
