import db from '../../data/index.js'

const run = async (players) => {
  await db.Player.truncate()
  await db.Player.bulkCreate(players)
}

export { run }
