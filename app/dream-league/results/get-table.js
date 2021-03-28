const db = require('../../data/models')
const sortArray = require('../../utils/sort-array')
const { getConceded, getGoals } = require('./get-goals')
const getResult = require('./get-result')
const getPoints = require('./get-points')

async function getTable (gameweekId, managers) {
  const rows = []
  for (const manager of managers) {
    const gameweekResults = await getGameweekResults(gameweekId, manager.managerId)
    const won = gameweekResults.filter(x => x.result === 'W').length
    const drawn = gameweekResults.filter(x => x.result === 'D').length
    const lost = gameweekResults.filter(x => x.result === 'L').length
    const gf = gameweekResults.reduce((x, y) => x + y.goals, 0)
    const ga = gameweekResults.reduce((x, y) => x + y.conceded, 0)
    const gd = gf - ga
    const points = gameweekResults.reduce((x, y) => x + y.points, 0)
    rows.push({
      managerId: manager.managerId,
      manager: manager.name,
      played: gameweekId,
      won,
      drawn,
      lost,
      gf,
      ga,
      gd,
      points
    })
  }
  return orderTable(rows)
}

async function getGameweekResults (gameweekId, managerId) {
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

function orderTable (rows) {
  return rows.sort((a, b) => { return sortArray(b.points, a.points) || sortArray(b.gd, a.gd) || sortArray(b.gf, a.gf) || sortArray(a.manager, b.manager) })
    .map((x, i) => ({ position: i + 1, ...x }))
}

module.exports = getTable
