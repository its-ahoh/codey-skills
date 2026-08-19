// A version nobody bumps is worse than no version: it says the installed copy
// matches something it does not. Fail when a SKILL.md changed in this push or
// pull request without its frontmatter version changing too.
import { execFileSync } from 'node:child_process'

const base = process.argv[2]
const head = process.argv[3] ?? 'HEAD'

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim()
const versionAt = (ref, file) => {
  let text
  try { text = git('show', `${ref}:${file}`) } catch { return null } // new file
  return /^version:\s*(\S+)$/m.exec(text.split('---')[1] ?? '')?.[1] ?? '(missing)'
}

const changed = git('diff', '--name-only', `${base}..${head}`)
  .split('\n')
  .filter(file => /^skills\/[^/]+\/SKILL\.md$/.test(file))

const problems = []
for (const file of changed) {
  const before = versionAt(base, file)
  const after = versionAt(head, file)
  if (before === null) continue // added in this range
  if (before === after) problems.push(`${file}: changed but version stayed ${after}`)
}

if (problems.length) {
  console.error('Version checks failed:')
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}
console.log(changed.length ? `Version bumped for: ${changed.join(', ')}` : 'No skill text changed')
