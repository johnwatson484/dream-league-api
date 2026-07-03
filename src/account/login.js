import bcrypt from 'bcrypt'
import { getUser } from './user-manager.js'
import { create } from '../token/create.js'

export async function login (email, password) {
  const user = await getUser(email)

  if (user === null || !await bcrypt.compare(password, user.passwordHash)) {
    return false
  }

  return {
    token: create(user),
  }
}
