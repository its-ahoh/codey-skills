// Every entry in this repository is one directory under skills/ or plugins/
// holding a SKILL.md whose frontmatter agents read. Codey installs these by
// name, so a name that disagrees with its directory installs to one place and
// announces itself as another.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOTS = ['plugins', 'skills']
const problems = []
const checked = []

for (const root of ROOTS) {
  const base = new URL(`../${root}/`, import.meta.url).pathname
  if (!existsSync(base)) {
    problems.push(`${root}/ is missing`)
    continue
  }
  const dirs = readdirSync(base, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort()

  if (dirs.length === 0) problems.push(`${root}/ has no skill directories`)

  for (const dir of dirs) {
    const label = `${root}/${dir}`
    checked.push(label)
    const file = join(base, dir, 'SKILL.md')
    if (!existsSync(file)) {
      problems.push(`${label}: no SKILL.md`)
      continue
    }
    const text = readFileSync(file, 'utf8')
    const match = /^---\n([\s\S]*?)\n---\n/.exec(text)
    if (!match) {
      problems.push(`${label}: SKILL.md does not start with a frontmatter block`)
      continue
    }
    // Top-level keys only. A YAML block scalar (`description: >-` followed by
    // indented lines) is folded into one line, the way agents read it.
    const fields = {}
    let key
    for (const line of match[1].split('\n')) {
      const top = /^([a-z][a-z-]*):\s*(.*)$/.exec(line)
      if (top) {
        key = top[1]
        fields[key] = /^[>|][-+]?$/.test(top[2].trim()) ? '' : top[2].trim()
      } else if (key && /^\s+\S/.test(line)) {
        fields[key] = `${fields[key]} ${line.trim()}`.trim()
      }
    }
    if (fields.name !== dir) problems.push(`${label}: frontmatter name is "${fields.name ?? '(missing)'}"`)
    // A skill's version is its folder's tree hash, which the install stamps into
    // the copy it writes — a semver in the frontmatter would have to be bumped by
    // hand every time the text moves, and an unbumped one lies. So no version
    // line is expected here.
    // The description is the only part always in an agent's context, and the
    // only thing deciding whether the skill is ever read. An empty or vague one
    // is a skill that never fires.
    if (!fields.description) problems.push(`${label}: frontmatter has no description`)
    else if (fields.description.length < 40) problems.push(`${label}: description is too short to trigger on (${fields.description.length} chars)`)
    // Some skills are deliberately one instruction long (pstack's `bro`), so the
    // floor only rejects a body that is effectively empty.
    if (text.slice(match[0].length).trim().length < 100) problems.push(`${label}: body is too short to be instructions`)
  }
}

if (problems.length) {
  console.error('Skill checks failed:')
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}
console.log(`Checked ${checked.length} skill(s): ${checked.join(', ')}`)
