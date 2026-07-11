import db from '../data/index.ts'
import { createSummary } from './create-summary.ts'

export async function update (results: any): Promise<void> {
  const transaction = await db.sequelize.transaction()
  try {
    await db.Goal.destroy({ where: { gameweekId: results.gameweekId }, transaction })
    await db.Concede.destroy({ where: { gameweekId: results.gameweekId }, transaction })
    await db.Summary.destroy({ where: { gameweekId: results.gameweekId }, transaction })

    const resultsDate = new Date()
    await updateConceded(results, resultsDate, false, transaction)
    await updateGoals(results, resultsDate, false, transaction)
    await updateConceded(results, resultsDate, true, transaction)
    await updateGoals(results, resultsDate, true, transaction)

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }

  await createSummary(results.gameweekId)
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
