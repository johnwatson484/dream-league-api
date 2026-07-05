import bcrypt from 'bcrypt'
import { getUser } from './user-manager.ts'
import { create } from '../token/create.ts'

const DUMMY_HASH = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'

export async function login (email: string, password: string) {
  const user = await getUser(email)

  if (!await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH) || user === null) {
    return false
  }

  return create(user)
}
