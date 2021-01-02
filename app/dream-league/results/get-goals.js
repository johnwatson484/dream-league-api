const db = require('../../data/models')

async function getGoals (gameweekId, managerId) {
  return await db.Goal.findAll({ where: { managerId, gameweekId, cup: false } })
}

async function getConceded (gameweekId, managerId) {
  return await db.Concede.findAll({ where: { managerId, gameweekId, cup: false } })
}

module.exports = {
  getGoals,
  getConceded
}
