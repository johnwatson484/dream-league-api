import db from '../data/index.ts'
import { createSummary } from './create-summary.ts'
import { withResultsTransaction } from './transaction.ts'
import { getCupScoreState, invalidateCupResults } from './invalidate-cup-results.ts'

export async function update (results: any): Promise<void> {
  await withResultsTransaction(async transaction => {
    const previousCupScores = await getCupScoreState(results.gameweekId, transaction)
    await db.Goal.destroy({ where: { gameweekId: results.gameweekId }, transaction })
    await db.Concede.destroy({ where: { gameweekId: results.gameweekId }, transaction })
    await db.Summary.destroy({ where: { gameweekId: results.gameweekId }, transaction })

    const resultsDate = new Date()
    await updateConceded(results, resultsDate, false, transaction)
    await updateGoals(results, resultsDate, false, transaction)
    await updateConceded(results, resultsDate, true, transaction)
    await updateGoals(results, resultsDate, true, transaction)

    const currentCupScores = await getCupScoreState(results.gameweekId, transaction)
    const changedManagers = [...new Set([...previousCupScores.keys(), ...currentCupScores.keys()])]
      .filter(managerId => previousCupScores.get(managerId) !== currentCupScores.get(managerId))
    if (changedManagers.length) {
      await invalidateCupResults(results.gameweekId, transaction, changedManagers)
    }
    await createSummary(results.gameweekId, transaction)
  })
}

async function updateConceded (results: any, resultsDate: Date, cup: boolean, transaction: any): Promise<void> {
  const sourceKey = cup ? 'concededCup' : 'conceded'
  const conceded = results[sourceKey]?.filter((x: any) => x.conceded > 0) || []
  for (const concede of conceded) {
    const manager: any = await db.ManagerKeeper.findOne({ where: { teamId: concede.teamId }, transaction })
    if (manager) {
      for (let i = 0; i < concede.conceded; i++) {
        await db.Concede.create({
          teamId: concede.teamId,
          gameweekId: results.gameweekId,
          managerId: manager.managerId,
          cup,
          created: resultsDate,
          createdBy: 'results-sheet',
        }, { transaction })
      }
    }
  }
}

async function updateGoals (results: any, resultsDate: Date, cup: boolean, transaction: any): Promise<void> {
  const sourceKey = cup ? 'goalsCup' : 'goals'
  const goals = results[sourceKey]?.filter((x: any) => x.goals > 0) || []
  for (const goal of goals) {
    const manager: any = await db.ManagerPlayer.findOne({ where: { playerId: goal.playerId }, transaction })
    if (manager) {
      for (let i = 0; i < goal.goals; i++) {
        await db.Goal.create({
          playerId: goal.playerId,
          gameweekId: results.gameweekId,
          managerId: manager.managerId,
          cup,
          created: resultsDate,
          createdBy: 'results-sheet',
        }, { transaction })
      }
    }
  }
}
