# Codey Skills

Skills that [Codey](https://github.com/its-ahoh/codey) installs for coding agents.

A skill is one markdown file. Only its `description` stays in an agent's
context; the body is read when a task actually needs it. Every agent Codey runs
discovers skills through `.claude/skills` or `.agents/skills`, so one file
reaches Claude Code, Codex, OpenCode and pi alike — including agents with no MCP
support at all.

## Skills

| Skill | What it does |
|-------|--------------|
| [`browser`](skills/browser/SKILL.md) | Drive the user-visible Codey Browser: open, read, screenshot and click through pages, including pages behind the user's existing logins. |

## Installing

From the Codey Mac app: **Tools → Plugins → Install**. That writes the skill
into `~/.codey/skills/<name>/` and links it into every agent's discovery
directory. Once installed the copy is yours — the Skills tab can turn it off or
delete it, and Codey will not rewrite it.

By hand, without the app:

```bash
git clone https://github.com/its-ahoh/codey-skills.git
cp -R codey-skills/skills/browser ~/.codey/skills/
```

## A skill is not the capability

`browser` documents a CLI that ships inside the Codey Mac app, and that CLI only
works when the app hands the agent its bridge credentials. Installing the skill
by hand outside Codey gives an agent the instructions, not the browser.

This is also why the app ships its own copy of each skill rather than pulling
from this repository at install time: an independently-versioned copy could
describe commands the installed app does not have, and the agent would fail
without knowing why. Treat this repository as the readable source — the app's
copy is the one that must match its own CLI.

## Adding a skill

One directory under `skills/`, holding one `SKILL.md`:

```
skills/<name>/SKILL.md
---
name: <name>              # must match the directory
version: <x.y.z>          # bump it whenever the text changes
description: <when to use this, written to trigger on the user's own words>
---
<the instructions>
```

`node scripts/check-skills.mjs` enforces that shape, and CI runs it on every
push and pull request. The description is the only part always in an agent's
context and the only thing deciding whether the body is ever read, so write it
with the phrases a user would actually type.

CI also fails a change to a `SKILL.md` that leaves its `version` alone
(`scripts/check-version-bump.mjs`). Codey stamps the version into the copy it
installs, and a version that does not move says the installed copy matches
something it does not.

## Contributing

Issues and pull requests are welcome. Direct pushes are restricted to the
repository owner.

## License

MIT — see [LICENSE](LICENSE).
