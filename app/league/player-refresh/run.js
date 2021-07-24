const db = require('../../data')

async function run (players) {
  await db.Player.truncate()
  await db.Player.bulkCreate(players)
}

module.exports = run
