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

## Contributing

Issues and pull requests are welcome. Direct pushes are restricted to the
repository owner.

## License

MIT — see [LICENSE](LICENSE).
