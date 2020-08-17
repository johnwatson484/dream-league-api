const db = require('../../data/models')

async function refresh (players) {
  await db.Player.truncate()
  await db.Player.bulkCreate(players)
}

module.exports = refresh
