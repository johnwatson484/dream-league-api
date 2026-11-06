import db from '../data/index.ts'
import { getConceded, getGoals } from './get-goals.ts'
import { getResult } from './get-result.ts'
import type { Transactionable } from 'sequelize'

export async function getScores (gameweekId: number, managers: any[], cup = false, options: Transactionable = {}): Promise<any[]> {
  const scores = []
  for (const manager of managers) {
    const goals = await getGoals(gameweekId, manager.managerId, cup, options)
    const conceded = await getConceded(gameweekId, manager.managerId, cup, options)
    const scorers = await getScorers(goals, options)
    const result = getResult(goals.length, conceded.length)

    scores.push({
      managerId: manager.managerId,
      manager: manager.name,
      goals: goals.length,
      conceded: conceded.length,
      margin: goals.length - conceded.length,
      result,
      scorers,
    })
  }
  return scores
}

async function getScorers (goals: any[], options: Transactionable): Promise<any[]> {
  const goalsPerPlayer = new Map<number, any>()
  for (const goal of goals) {
    const entry = goalsPerPlayer.get(goal.playerId)
    if (entry) {
      entry.goals += 1
    } else {
      goalsPerPlayer.set(goal.playerId, { playerId: goal.playerId, goals: 1 })
    }
  }
  const scorers = [...goalsPerPlayer.values()]
  for (const scorer of scorers) {
    const player: any = await db.Player.findOne({ ...options, where: { playerId: scorer.playerId } })
    scorer.name = player.lastNameInitial
  }
  return scorers
}
