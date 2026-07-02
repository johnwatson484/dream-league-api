import db from '../../data/index.js'

async function deleteCurrentTeam (managerId) {
  await db.ManagerKeeper.destroy({ where: { managerId } })
  await db.ManagerPlayer.destroy({ where: { managerId } })
  await db.Teamsheet.destroy({ where: { managerId } })
}

export { deleteCurrentTeam }
