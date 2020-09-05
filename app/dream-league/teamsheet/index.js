const refresh = require('./refresh')
const db = require('../../data/models')

async function get () {
  const managers = await db.Manager.findAll({
    include: [
      { model: db.Player, as: 'players' },
      { model: db.Team, as: 'keepers' },
      { model: db.Teamsheet, as: 'teamsheet' }
    ],
    order: [['name']],
    nested: true
  })

  return managers.map(x => x.dataValues)
}

module.exports = {
  get,
  refresh
}
