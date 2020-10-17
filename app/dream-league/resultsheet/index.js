const db = require('../../data/models')

async function get () {
  const gameweeks = await db.Gameweek.findAll()
  const keepers = await db.ManagerKeeper.findAll({
    where: { substitute: false },
    include: [{ model: db.Team }]
  })
  const players = await db.ManagerPlayer.findAll({
    where: { substitute: false },
    include: [{
      model: db.Player,
      include: [{ model: db.Team, as: 'team' }]
    }, {
      model: db.Manager
    }]
  })
  return { gameweeks, keepers, players }
}

module.exports = {
  get
}
