import db from '../../data/index.ts'

export async function run (players: any[]): Promise<void> {
  await db.Player.truncate()
  await db.Player.bulkCreate(players)
}
