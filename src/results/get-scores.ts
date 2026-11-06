import db from '../data/index.ts'
import { getResult } from './get-result.ts'
import type { Transactionable } from 'sequelize'

export async function getScores (gameweekId: number, managers: any[], cup = false, options: Transactionable = {}): Promise<any[]> {
  const managerIds = managers.map(manager => manager.managerId)
  const where = { gameweekId, managerId: managerIds, cup }
  const [allGoals, allConceded] = await Promise.all([
    db.Goal.findAll({ ...options, where }),
    db.Concede.findAll({ ...options, where }),
  ])
  const playerIds = [...new Set(allGoals.map((goal: any) => goal.playerId))]
  const players = await db.Player.findAll({ ...options, where: { playerId: playerIds } })
  const playerNames = new Map(players.map((player: any) => [player.playerId, player.lastNameInitial]))

  return managers.map(manager => {
    const goals = allGoals.filter((goal: any) => goal.managerId === manager.managerId)
    const conceded = allConceded.filter((concede: any) => concede.managerId === manager.managerId)
    const scorers = getScorers(goals, playerNames)
    const result = getResult(goals.length, conceded.length)

    return {
      managerId: manager.managerId,
      manager: manager.name,
      goals: goals.length,
      conceded: conceded.length,
      margin: goals.length - conceded.length,
      result,
      scorers,
    }
  })
}

function getScorers (goals: any[], playerNames: Map<number, string>): any[] {
  const goalsPerPlayer = new Map<number, any>()
  for (const goal of goals) {
    const entry = goalsPerPlayer.get(goal.playerId)
    if (entry) {
      entry.goals += 1
    } else {
      goalsPerPlayer.set(goal.playerId, { playerId: goal.playerId, goals: 1 })
    }
  }
  return [...goalsPerPlayer.values()].map(scorer => {
    if (!playerNames.has(scorer.playerId)) { throw new Error(`Player ${scorer.playerId} not found`) }
    return { ...scorer, name: playerNames.get(scorer.playerId) }
  })
}
