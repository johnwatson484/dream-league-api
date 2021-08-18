const db = require('../data')

async function getCompleted () {
  return await db.Gameweek.findAll({ include: { model: db.Summary, as: 'summary', attributes: [], required: true } })
}

async function getAll () {
  return await db.Gameweek.findAll()
}

module.exports = {
  getCompleted,
  getAll
}
