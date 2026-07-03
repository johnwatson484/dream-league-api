import db from '../data/index.js'

export async function deleteManager (managerId) {
  await db.Email.destroy({ where: { managerId } })
  await db.Manager.destroy({ where: { managerId } })
}
