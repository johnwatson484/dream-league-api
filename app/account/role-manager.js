const db = require('../data/models')

async function getRole (roleName) {
  return db.Role.findOne({ where: { name: roleName } })
}

async function addUserToRole (userId, roleName) {
  const role = await getRole(roleName)
  await db.UserRole.create({ userId, roleId: role.roleId })
}

async function getUserRoles (userId) {
  return db.UserRole.findAll({
    where: { userId },
    raw: true,
    nest: true,
    attributes: [],
    include: [db.Role]
  })
}

module.exports = {
  addUserToRole,
  getUserRoles
}
