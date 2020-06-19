const db = require('../data/models')

async function getRole (roleName) {
  return db.role.findOne({ where: { name: roleName } })
}

async function addUserToRole (userId, roleName) {
  const role = await getRole(roleName)
  await db.userRole.create({ userId, roleId: role.roleId })
}

module.exports = addUserToRole
