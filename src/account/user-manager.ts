import db from '../data/index.ts'
import bcrypt from 'bcrypt'
import { addUserToRole, getUserRoles } from './role-manager.ts'

export async function userExists (email: string): Promise<boolean> {
  return await getUser(email) !== null
}

export async function isMember (email: string): Promise<boolean> {
  const memberEmail = await db.Email.findOne({ where: { address: email } })
  return memberEmail !== null
}

export async function getUser (email: string): Promise<any> {
  const user: any = await db.User.findOne({
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

export async function getUserById (userId: number): Promise<any> {
  const user: any = await db.User.findOne({
    where: { userId },
    raw: true,
  })
  if (user !== null) {
    user.roles = await getUserRoles(user.userId)
  }
  return user
}

export async function createUser (email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10)

  const user = await db.User.create({
    email,
    passwordHash,
  })

  await addUserToRole((user as any).userId, 'user')
  return getUser(email)
}
