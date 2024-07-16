const db = require('../data')

const getGoals = async (gameweekId, managerId, cup = false) => {
  return db.Goal.findAll({ where: { managerId, gameweekId, cup } })
}

const getConceded = async (gameweekId, managerId, cup = false) => {
  return db.Concede.findAll({ where: { managerId, gameweekId, cup } })
}

module.exports = {
  getGoals,
  getConceded,
}
