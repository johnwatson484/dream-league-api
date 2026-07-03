import bcrypt from 'bcrypt'
import { getUser } from './user-manager.js'
import { create } from '../token/create.js'

const DUMMY_HASH = '$2b$10$dummyhashxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

export async function login (email, password) {
  const user = await getUser(email)

  if (!await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH) || user === null) {
    return false
  }

  return create(user)
}
