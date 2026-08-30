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
| [`chrome-companion`](skills/chrome-companion/SKILL.md) | Drive the user's real Google Chrome through the Codey Chrome Companion extension, using their existing windows, tabs and logins. |

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

Install pulls the text from this repository so wording can be corrected without
shipping a new app build, and falls back to the copy bundled with the app when
the repository cannot be reached. Because the published text can move ahead of
an installed app, keep it compatible with the commands older builds actually
have: describe a new command only once the app that implements it has shipped.

## Adding a skill

One directory under `skills/`, holding one `SKILL.md`:

```
skills/<name>/SKILL.md
---
name: <name>              # must match the directory
description: <when to use this, written to trigger on the user's own words>
---
<the instructions>
```

`node scripts/check-skills.mjs` enforces that shape, and CI runs it on every
push and pull request. The description is the only part always in an agent's
context and the only thing deciding whether the body is ever read, so write it
with the phrases a user would actually type.

A skill carries no version line. Its version is its folder's tree hash, which
Codey stamps into the copy an install writes: it moves exactly when the skill's
own files move, and never for an edit elsewhere in the repository.

## Contributing

Issues and pull requests are welcome. Direct pushes are restricted to the
repository owner.

## License

MIT — see [LICENSE](LICENSE).
