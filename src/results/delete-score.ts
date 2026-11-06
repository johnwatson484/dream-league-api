import db from '../data/index.ts'
import { createSummary } from './create-summary.ts'
import { withResultsTransaction } from './transaction.ts'
import { invalidateCupResults } from './invalidate-cup-results.ts'

export async function deleteScore (kind: 'goal' | 'concede', id: number): Promise<boolean> {
  return withResultsTransaction(async transaction => {
    const model = kind === 'goal' ? db.Goal : db.Concede
    const score = await model.findByPk(id, { transaction })
    if (!score) { return false }

    const gameweekId = Number(score.get('gameweekId'))
    await score.destroy({ transaction })
    if (score.get('cup')) {
      await invalidateCupResults(gameweekId, transaction, [Number(score.get('managerId'))])
    }
    await createSummary(gameweekId, transaction)
    return true
  })
}
