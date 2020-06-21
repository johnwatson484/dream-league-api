const db = require('../data/models')

async function getRole (roleName) {
  return db.role.findOne({ where: { name: roleName } })
}

async function addUserToRole (userId, roleName) {
  const role = await getRole(roleName)
  await db.userRole.create({ userId, roleId: role.roleId })
}

async function getUserRoles (userId) {
  return db.userRole.findAll({
    where: { userId },
    raw: true,
    attributes: [],
    include: [db.role]
  })
}

module.exports = {
  addUserToRole,
  getUserRoles
}
