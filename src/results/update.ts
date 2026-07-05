import db from '../data/index.ts'
import { createSummary } from './create-summary.ts'

export async function update (results: any): Promise<void> {
  const resultsDate = new Date()
  await updateConceded(results, resultsDate)
  await updateGoals(results, resultsDate)
  await updateConcededCup(results, resultsDate)
  await updateGoalsCup(results, resultsDate)
  await createSummary(results.gameweekId)
}

async function updateConceded (results: any, resultsDate: Date): Promise<void> {
  const conceded = results.conceded?.filter((x: any) => x.conceded > 0) || []
  for (const concede of conceded) {
    const manager: any = await db.ManagerKeeper.findOne({ where: { teamId: concede.teamId } })
    if (manager) {
      for (let i = 0; i < concede.conceded; i++) {
        await db.Concede.create({
          teamId: concede.teamId,
          gameweekId: results.gameweekId,
          managerId: manager.managerId,
          cup: false,
          created: resultsDate,
          createdBy: 'results-sheet',
        })
      }
    }
  }
}

async function updateGoals (results: any, resultsDate: Date): Promise<void> {
  const goals = results.goals?.filter((x: any) => x.goals > 0) || []
  for (const goal of goals) {
    const manager: any = await db.ManagerPlayer.findOne({ where: { playerId: goal.playerId } })
    if (manager) {
      for (let i = 0; i < goal.goals; i++) {
        await db.Goal.create({
          playerId: goal.playerId,
          gameweekId: results.gameweekId,
          managerId: manager.managerId,
          cup: false,
          created: resultsDate,
          createdBy: 'results-sheet',
        })
      }
    }
  }
}

async function updateConcededCup (results: any, resultsDate: Date): Promise<void> {
  const conceded = results.concededCup?.filter((x: any) => x.conceded > 0) || []
  for (const concede of conceded) {
    const manager: any = await db.ManagerKeeper.findOne({ where: { teamId: concede.teamId } })
    if (manager) {
      for (let i = 0; i < concede.conceded; i++) {
        await db.Concede.create({
          teamId: concede.teamId,
          gameweekId: results.gameweekId,
          managerId: manager.managerId,
          cup: true,
          created: resultsDate,
          createdBy: 'results-sheet',
        })
      }
    }
  }
}

async function updateGoalsCup (results: any, resultsDate: Date): Promise<void> {
  const goals = results.goalsCup?.filter((x: any) => x.goals > 0) || []
  for (const goal of goals) {
    const manager: any = await db.ManagerPlayer.findOne({ where: { playerId: goal.playerId } })
    if (manager) {
      for (let i = 0; i < goal.goals; i++) {
        await db.Goal.create({
          playerId: goal.playerId,
          gameweekId: results.gameweekId,
          managerId: manager.managerId,
          cup: true,
          created: resultsDate,
          createdBy: 'results-sheet',
        })
      }
    }
  }
}
