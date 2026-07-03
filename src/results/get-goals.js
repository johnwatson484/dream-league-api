import db from '../data/index.js'

const getGoals = async (gameweekId, managerId, cup = false) => {
  return db.Goal.findAll({ where: { managerId, gameweekId, cup } })
}

const getConceded = async (gameweekId, managerId, cup = false) => {
  return db.Concede.findAll({ where: { managerId, gameweekId, cup } })
}

export { getGoals, getConceded }
