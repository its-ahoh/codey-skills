// Every skill in this repository is one directory under skills/ holding a
// SKILL.md whose frontmatter agents read. Codey installs these by name, so a
// name that disagrees with its directory installs to one place and announces
// itself as another.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('../skills/', import.meta.url).pathname
const problems = []

const dirs = readdirSync(ROOT, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .sort()

if (dirs.length === 0) problems.push('skills/ has no skill directories')

for (const dir of dirs) {
  const file = join(ROOT, dir, 'SKILL.md')
  if (!existsSync(file)) {
    problems.push(`${dir}: no SKILL.md`)
    continue
  }
  const text = readFileSync(file, 'utf8')
  const match = /^---\n([\s\S]*?)\n---\n/.exec(text)
  if (!match) {
    problems.push(`${dir}: SKILL.md does not start with a frontmatter block`)
    continue
  }
  const fields = Object.fromEntries(
    match[1].split('\n')
      .map(line => /^([a-z]+):\s*(.*)$/.exec(line))
      .filter(Boolean)
      .map(m => [m[1], m[2].trim()]),
  )
  if (fields.name !== dir) problems.push(`${dir}: frontmatter name is "${fields.name ?? '(missing)'}"`)
  // The description is the only part always in an agent's context, and the
  // only thing deciding whether the skill is ever read. An empty or vague one
  // is a skill that never fires.
  if (!fields.description) problems.push(`${dir}: frontmatter has no description`)
  else if (fields.description.length < 40) problems.push(`${dir}: description is too short to trigger on (${fields.description.length} chars)`)
  if (text.slice(match[0].length).trim().length < 200) problems.push(`${dir}: body is too short to be instructions`)
}

if (problems.length) {
  console.error('Skill checks failed:')
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}
console.log(`Checked ${dirs.length} skill(s): ${dirs.join(', ')}`)
