import db from '../data/index.ts'
import { createSummary } from './create-summary.ts'

export async function update (results: any): Promise<void> {
  const resultsDate = new Date()
  await updateConceded(results, resultsDate, false)
  await updateGoals(results, resultsDate, false)
  await updateConceded(results, resultsDate, true)
  await updateGoals(results, resultsDate, true)
  await createSummary(results.gameweekId)
}

async function updateConceded (results: any, resultsDate: Date, cup: boolean): Promise<void> {
  const sourceKey = cup ? 'concededCup' : 'conceded'
  const conceded = results[sourceKey]?.filter((x: any) => x.conceded > 0) || []
  for (const concede of conceded) {
    const manager: any = await db.ManagerKeeper.findOne({ where: { teamId: concede.teamId } })
    if (manager) {
      for (let i = 0; i < concede.conceded; i++) {
        await db.Concede.create({
          teamId: concede.teamId,
          gameweekId: results.gameweekId,
          managerId: manager.managerId,
          cup,
          created: resultsDate,
          createdBy: 'results-sheet',
        })
      }
    }
  }
}

async function updateGoals (results: any, resultsDate: Date, cup: boolean): Promise<void> {
  const sourceKey = cup ? 'goalsCup' : 'goals'
  const goals = results[sourceKey]?.filter((x: any) => x.goals > 0) || []
  for (const goal of goals) {
    const manager: any = await db.ManagerPlayer.findOne({ where: { playerId: goal.playerId } })
    if (manager) {
      for (let i = 0; i < goal.goals; i++) {
        await db.Goal.create({
          playerId: goal.playerId,
          gameweekId: results.gameweekId,
          managerId: manager.managerId,
          cup,
          created: resultsDate,
          createdBy: 'results-sheet',
        })
      }
    }
  }
}
