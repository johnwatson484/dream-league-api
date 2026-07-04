import db from '../../data/index.ts'

export async function run (players) {
  await db.Player.truncate()
  await db.Player.bulkCreate(players)
}
