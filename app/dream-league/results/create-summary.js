const db = require('../../data/models')

async function createSummary (gameweekId) {
  const managers = await db.Manager.findAll()
  const scores = await getScores(gameweekId, managers)
  const table = await getTable(gameweekId, managers)
  return {
    gameweekId,
    scores,
    table
  }
}

async function getScores (gameweekId, managers) {
  const scores = []
  for (const manager of managers) {
    const goals = await getGoals(gameweekId, manager.managerId)
    const conceded = await getConceded(gameweekId, manager.managerId)

    const scorers = []
    goals.reduce((x, y) => {
      if (!x[y.playerId]) {
        x[y.playerId] = { playerId: y.playerId, goals: 0 }
        scorers.push(x[y.playerId])
      }
      x[y.playerId].goals += 1
      return x
    }, {})

    for (const scorer in scorers) {
      const player = await db.Player.findOne({ where: { playerId: scorer.playerId } })
      scorer.name = player.lastNameInitial
    }

    const result = getResult(goals.length, conceded.length)

    scores.push({
      managerId: manager.managerId,
      manager: manager.name,
      goals: goals.length,
      conceded: conceded.length,
      result,
      scorers
    })
  }
  return scores
}

async function getGoals (gameweekId, managerId) {
  return await db.Goal.findAll({ where: { managerId, gameweekId, cup: false } })
}

async function getConceded (gameweekId, managerId) {
  return await db.Concede.findAll({ where: { managerId, gameweekId, cup: false } })
}

function getResult (goals, conceded) {
  if (goals > conceded) {
    return 'W'
  }
  if (goals < conceded) {
    return 'L'
  }
  return 'D'
}

function getPoints (result) {
  switch (result) {
    case 'W':
      return 3
    case 'D':
      return 1
    default:
      return 0
  }
}

async function getTable (gameweekId, managers) {
  const rows = []
  for (const manager of managers) {
    const gameweekResults = await getGameweekResults(gameweekId, manager.managerId)
    const won = gameweekResults.filter(x => x.result === 'W').length
    const drawn = gameweekResults.filter(x => x.result === 'D').length
    const lost = gameweekResults.filter(x => x.result === 'L').length
    const gf = gameweekResults.reduce((x, y) => x.goals + y.goals, 0)
    const ga = gameweekResults.reduce((x, y) => x.conceded + y.conceded, 0)
    const gd = gf - ga
    const points = gameweekResults.reduce((x, y) => x.points + y.points, 0)
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
  return rows.sort((a, b) => { return sortFn(a.points, b.points) || sortFn(a.gd, b.gd) || sortFn(a.gf, b.gf) || sortFn(a.manager, b.manager) })
}

async function getGameweekResults (gameweekId, managerId) {
  const gameweeks = await db.Gameweek.findAll({ where: { gameweekId: { [db.Sequelize.Op.lte]: gameweekId } } })
  const gameweekResults = []
  for (const gameweek of gameweeks) {
    const goals = await getGoals(gameweek.gameweekId, managerId)
    const conceded = await getConceded(gameweek.gameweekId, managerId)
    const result = getResult(goals.length, conceded.length)
    const points = getPoints(result)
    gameweekResults.push({ result, points, goals: goals.length, conceded: conceded.length })
  }
}

function sortFn (a, b) {
  return a === b ? 0 : a < b ? -1 : 1
}

module.exports = createSummary
