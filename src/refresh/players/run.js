import db from '../../data/index.js'

export async function run (players) {
  await db.Player.truncate()
  await db.Player.bulkCreate(players)
}
