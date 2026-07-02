import db from '../data/index.js'

const deleteManager = async (managerId) => {
  await db.Email.destroy({ where: { managerId } })
  await db.Manager.destroy({ where: { managerId } })
}

export { deleteManager }
