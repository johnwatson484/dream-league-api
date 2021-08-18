const db = require('../data')
const { getConceded, getGoals } = require('./get-goals')
const getPoints = require('./get-points')
const getResult = require('./get-result')

const getGameweekResults = async (gameweekId, managerId) => {
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

module.exports = getGameweekResults
