import db from '../data/index.ts'
import { createSummary } from './create-summary.ts'
import { withResultsTransaction } from './transaction.ts'
import { invalidateCupResults } from './invalidate-cup-results.ts'

export async function deleteResultEntry (kind: 'goal' | 'concede', id: number): Promise<boolean> {
  return withResultsTransaction(async transaction => {
    const model = kind === 'goal' ? db.Goal : db.Concede
    const entry = await model.findByPk(id, { transaction })
    if (!entry) { return false }

    const gameweekId = Number(entry.get('gameweekId'))
    await entry.destroy({ transaction })
    if (entry.get('cup')) {
      await invalidateCupResults(gameweekId, transaction, [Number(entry.get('managerId'))])
    }
    await createSummary(gameweekId, transaction)
    return true
  })
}
