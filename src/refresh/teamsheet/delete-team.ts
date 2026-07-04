import db from '../../data/index.ts'

async function deleteCurrentTeam (managerId) {
  await db.ManagerKeeper.destroy({ where: { managerId } })
  await db.ManagerPlayer.destroy({ where: { managerId } })
  await db.Teamsheet.destroy({ where: { managerId } })
}

export { deleteCurrentTeam }
