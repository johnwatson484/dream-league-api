const db = require('../data/models')
const { addUserToRole, getUserRoles } = require('./role-manager')
const bcrypt = require('bcrypt')

async function userExists (email) {
  if (await getUser(email) !== null) {
    console.log(await getUser(email))
    return true
  }
  return false
}

async function getUser (email) {
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

async function createUser (email, password) {
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
  createUser
}
