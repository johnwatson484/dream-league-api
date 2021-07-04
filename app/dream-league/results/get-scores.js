const db = require('../../data/models')
const { getConceded, getGoals } = require('./get-goals')
const getResult = require('./get-result')

async function getScores (gameweekId, managers, cup = false) {
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
      result,
      scorers
    })
  }
  return scores
}

async function getScorers (goals) {
  const scorers = []
  goals.reduce((x, y) => {
    if (!x[y.playerId]) {
      x[y.playerId] = { playerId: y.playerId, goals: 0 }
      scorers.push(x[y.playerId])
    }
    x[y.playerId].goals += 1
    return x
  }, {})
  for (const scorer of scorers) {
    const player = await db.Player.findOne({ where: { playerId: scorer.playerId } })
    scorer.name = player.lastNameInitial
  }
  return scorers
}

module.exports = getScores
