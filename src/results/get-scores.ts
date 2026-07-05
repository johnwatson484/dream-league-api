import db from '../data/index.ts'
import { getConceded, getGoals } from './get-goals.ts'
import { getResult } from './get-result.ts'

export async function getScores (gameweekId: number, managers: any[], cup = false): Promise<any[]> {
  const scores = []
  for (const manager of managers) {
    const goals = await getGoals(gameweekId, manager.managerId, cup)
    const conceded = await getConceded(gameweekId, manager.managerId, cup)
    const scorers = await getScorers(goals)
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

async function getScorers (goals: any[]): Promise<any[]> {
  const scorers: any[] = []
  goals.reduce((x, y) => {
    if (!x[y.playerId]) {
      x[y.playerId] = { playerId: y.playerId, goals: 0 }
      scorers.push(x[y.playerId])
    }
    x[y.playerId].goals += 1
    return x
  }, {})
  for (const scorer of scorers) {
    const player: any = await db.Player.findOne({ where: { playerId: scorer.playerId } })
    scorer.name = player.lastNameInitial
  }
  return scorers
}
