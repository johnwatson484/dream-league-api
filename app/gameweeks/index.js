const db = require('../data')

const getCompleted = async () => {
  return db.Gameweek.findAll({ include: { model: db.Summary, as: 'summary', attributes: [], required: true } })
}

const getAll = async () => {
  return db.Gameweek.findAll()
}

module.exports = {
  getCompleted,
  getAll
}
