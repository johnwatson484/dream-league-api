import { Op, type Transactionable } from 'sequelize'
import db from '../data/index.ts'
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
  const where = { managerId, gameweekId: gameweeks.map((gameweek: any) => gameweek.gameweekId), cup: false }
  const [allGoals, allConceded] = await Promise.all([
    db.Goal.findAll({ ...queryOptions, where }),
    db.Concede.findAll({ ...queryOptions, where }),
  ])
  return (gameweeks as any[]).map(gameweek => {
    const goals = allGoals.filter((goal: any) => goal.gameweekId === gameweek.gameweekId)
    const conceded = allConceded.filter((concede: any) => concede.gameweekId === gameweek.gameweekId)
    const result = getResult(goals.length, conceded.length)
    const points = getPoints(result)
    return { result, points, goals: goals.length, conceded: conceded.length }
  })
}
