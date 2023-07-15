const db = require('../data')

const deleteManager = async (managerId) => {
  await db.Email.destroy({ where: { managerId } })
  await db.Manager.destroy({ where: { managerId } })
}

module.exports = {
  deleteManager
}
