import db from '../src/data/index.ts'
import { createSummary } from '../src/results/create-summary.ts'

const maxGameweekId: number = await db.Goal.max('gameweekId') ?? 0

if (maxGameweekId === 0) {
  console.log('No goals found, skipping summary generation.')
  process.exit(0)
}

console.log(`Generating summaries for gameweeks 1-${maxGameweekId}...`)

for (let gw = 1; gw <= maxGameweekId; gw++) {
  await createSummary(gw)
  console.log(`  Summary generated for gameweek ${gw}`)
}

console.log('Done.')
process.exit(0)
