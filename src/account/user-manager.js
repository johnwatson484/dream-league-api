import db from '../data/index.js'
import bcrypt from 'bcrypt'
import { addUserToRole, getUserRoles } from './role-manager.js'

export async function userExists (email) {
  return await getUser(email) !== null
}

export async function isMember (email) {
  const memberEmail = await db.Email.findOne({ where: { address: email } })
  return memberEmail !== null
}

export async function getUser (email) {
  const user = await db.User.findOne({
    where: { email },
    raw: true,
  })
  // sequelize bug restricts use of include on many to many to only one result
  // therefore pulling roles in separate query
  if (user !== null) {
    user.roles = await getUserRoles(user.userId)
  }
  return user
}

export async function getUserById (userId) {
  const user = await db.User.findOne({
    where: { userId },
    raw: true,
  })
  if (user !== null) {
    user.roles = await getUserRoles(user.userId)
  }
  return user
}

export async function createUser (email, password) {
  const passwordHash = await bcrypt.hash(password, 10)

  const user = await db.User.create({
    email,
    passwordHash,
  })

  await addUserToRole(user.userId, 'user')
  return getUser(email)
}
