import bcrypt from 'bcrypt'
import { getUser } from './user-manager.js'
import { create } from '../token/create.js'

const DUMMY_HASH = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'

export async function login (email, password) {
  const user = await getUser(email)

  if (!await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH) || user === null) {
    return false
  }

  return create(user)
}
