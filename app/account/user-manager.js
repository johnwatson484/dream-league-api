const db = require('../data')
const bcrypt = require('bcrypt')
const { addUserToRole, getUserRoles } = require('./role-manager')

const userExists = async (email) => {
  return await getUser(email) !== null
}

const isMember = async (email) => {
  const memberEmail = await db.Email.findOne({ where: { address: email } })
  return memberEmail !== null
}

const getUser = async (email) => {
  const user = await db.User.findOne({
    where: { email },
    raw: true
  })
  // sequelize bug restricts use of include on many to many to only one result
  // therefore pulling roles in separate query
  if (user !== null) {
    user.roles = await getUserRoles(user.userId)
  }
  return user
}

const createUser = async (email, password) => {
  const passwordHash = await bcrypt.hash(password, 10)

  const user = await db.User.create({
    email,
    passwordHash
  })

  await addUserToRole(user.userId, 'user')
  return getUser(email)
}

module.exports = {
  userExists,
  getUser,
  createUser,
  isMember
}
