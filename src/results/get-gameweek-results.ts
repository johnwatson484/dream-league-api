import { Op, type Transactionable } from 'sequelize'
import db from '../data/index.ts'
import { getConceded, getGoals } from './get-goals.ts'
import { getPoints } from './get-points.ts'
import { getResult } from './get-result.ts'

export interface TableOptions extends Transactionable {
  completedGameweekIds?: number[]
}

export async function getGameweekResults (gameweekId: number, managerId: number, options: TableOptions = {}): Promise<any[]> {
  const { completedGameweekIds, ...queryOptions } = options
  const gameweeks = await db.Gameweek.findAll({
    ...queryOptions,
    where: { gameweekId: { [Op.lte]: gameweekId, ...(completedGameweekIds ? { [Op.in]: completedGameweekIds } : {}) } },
  })
  const gameweekResults = []
  for (const gameweek of gameweeks as any[]) {
    const goals = await getGoals(gameweek.gameweekId, managerId, false, queryOptions) || []
    const conceded = await getConceded(gameweek.gameweekId, managerId, false, queryOptions) || []
    const result = getResult(goals.length, conceded.length)
    const points = getPoints(result)
    gameweekResults.push({ result, points, goals: goals.length, conceded: conceded.length })
  }
  return gameweekResults
}
