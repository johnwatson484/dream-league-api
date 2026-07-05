import { Op } from 'sequelize'
import db from '../data/index.ts'
import { getConceded, getGoals } from './get-goals.ts'
import { getPoints } from './get-points.ts'
import { getResult } from './get-result.ts'

export async function getGameweekResults (gameweekId: number, managerId: number): Promise<any[]> {
  const gameweeks = await db.Gameweek.findAll({ where: { gameweekId: { [Op.lte]: gameweekId } } })
  const gameweekResults = []
  for (const gameweek of gameweeks as any[]) {
    const goals = await getGoals(gameweek.gameweekId, managerId) || []
    const conceded = await getConceded(gameweek.gameweekId, managerId) || []
    const result = getResult(goals.length, conceded.length)
    const points = getPoints(result)
    gameweekResults.push({ result, points, goals: goals.length, conceded: conceded.length })
  }
  return gameweekResults
}
