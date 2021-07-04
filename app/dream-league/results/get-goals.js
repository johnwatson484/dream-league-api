const db = require('../../data/models')

async function getGoals (gameweekId, managerId, cup = false) {
  return await db.Goal.findAll({ where: { managerId, gameweekId, cup } })
}

async function getConceded (gameweekId, managerId, cup = false) {
  return await db.Concede.findAll({ where: { managerId, gameweekId, cup } })
}

module.exports = {
  getGoals,
  getConceded
}
