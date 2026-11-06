import db from '../data/index.ts'
import { rebuildLaterSummaries } from './create-summary.ts'
import { withResultsTransaction } from './transaction.ts'
import { invalidateCupResults } from './invalidate-cup-results.ts'

export async function deleteResults (gameweekId: number): Promise<void> {
  await withResultsTransaction(async transaction => {
    await db.Concede.destroy({ where: { gameweekId }, transaction })
    await db.Goal.destroy({ where: { gameweekId }, transaction })
    await db.Summary.destroy({ where: { gameweekId }, transaction })
    await invalidateCupResults(gameweekId, transaction)
    await rebuildLaterSummaries(gameweekId, transaction)
  })
}
