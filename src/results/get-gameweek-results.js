import db from '../data/index.js'
import { getConceded, getGoals } from './get-goals.js'
import { getPoints } from './get-points.js'
import { getResult } from './get-result.js'

export async function getGameweekResults (gameweekId, managerId) {
  const gameweeks = await db.Gameweek.findAll({ where: { gameweekId: { [db.Sequelize.Op.lte]: gameweekId } } })
  const gameweekResults = []
  for (const gameweek of gameweeks) {
    const goals = await getGoals(gameweek.gameweekId, managerId) || []
    const conceded = await getConceded(gameweek.gameweekId, managerId) || []
    const result = getResult(goals.length, conceded.length)
    const points = getPoints(result)
    gameweekResults.push({ result, points, goals: goals.length, conceded: conceded.length })
  }
  return gameweekResults
}

