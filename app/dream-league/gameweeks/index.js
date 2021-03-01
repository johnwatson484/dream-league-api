const db = require('../../data/models')

async function getCompleted () {
  return await db.Gameweek.findAll({ include: { model: db.Summary, as: 'summary', attributes: [], required: true } })
}

module.exports = getCompleted
