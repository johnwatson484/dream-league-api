const db = require('../data')

const getRole = async (roleName) => {
  return db.Role.findOne({ where: { name: roleName } })
}

const addUserToRole = async (userId, roleName) => {
  const role = await getRole(roleName)
  await db.UserRole.create({ userId, roleId: role.roleId })
}

const getUserRoles = async (userId) => {
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
