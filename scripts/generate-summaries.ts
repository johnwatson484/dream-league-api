import db from '../src/data/index.ts'
import { rebuildExistingSummaries } from '../src/results/create-summary.ts'

try {
  console.log('Rebuilding submitted result summaries...')
  await rebuildExistingSummaries()
  console.log('Done.')
} finally {
  await db.sequelize.close()
}
