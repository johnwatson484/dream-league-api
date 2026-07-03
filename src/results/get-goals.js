import db from '../data/index.js'

export async function getGoals (gameweekId, managerId, cup = false) {
  return db.Goal.findAll({ where: { managerId, gameweekId, cup } })
}

export async function getConceded (gameweekId, managerId, cup = false) {
  return db.Concede.findAll({ where: { managerId, gameweekId, cup } })
}
