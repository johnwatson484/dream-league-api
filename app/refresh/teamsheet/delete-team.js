const db = require('../../data')

async function deleteCurrentTeam (managerId) {
  await db.ManagerKeeper.destroy({ where: { managerId } })
  await db.ManagerPlayer.destroy({ where: { managerId } })
  await db.Teamsheet.destroy({ where: { managerId } })
}

module.exports = {
  deleteCurrentTeam
}
