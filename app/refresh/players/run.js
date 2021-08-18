const db = require('../../data')

const run = async (players) => {
  await db.Player.truncate()
  await db.Player.bulkCreate(players)
}

module.exports = run
