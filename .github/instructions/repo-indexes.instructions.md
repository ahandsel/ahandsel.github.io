---
applyTo: 'skills/**,memory/**,.claude/**'
---

# Repository indexes and synchronized configuration

These folders carry indexes that a change has to keep in sync by hand, and no workflow checks them automatically.

* Adding, renaming, or removing a skill updates `skills/README.md` and synchronizes the `Skill(<name>)` allowlist in `.claude/settings.json`, which `node skills/skill-allowlist-syncer/scripts/check-skill-allowlist.mjs` reports on.
* Adding or changing a durable memory keeps `memory/MEMORY.md` in sync with the individual memory file.
* A new memory file uses a kebab-case slug that starts with the `auditing-`, `styling-`, `tooling-`, or `wording-` category prefix, and it records one subject.
* A new or renamed script under `skills/<skill-name>/scripts/` has matching permission entries in `.claude/settings.json`, in the correct `allow`, `ask`, or `deny` tier.
* The `WebFetch(domain:<host>)` entries in the `allow` array are the standing web-research allowlist that the "Web research" section of `AGENTS.md` describes.
  Adding or removing a site is a deliberate owner decision, so treat a change there as a policy change rather than a formatting one.
