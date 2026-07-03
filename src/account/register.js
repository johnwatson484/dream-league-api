import config from '../config/index.js'
import { create } from '../token/create.js'
import { userExists, createUser, isMember } from './user-manager.js'

export async function register (email, password) {
  if (await userExists(email)) {
    return false
  }

  if (!config.allowNonMemberRegistration && !await isMember(email)) {
    return false
  }

  const user = await createUser(email, password)

  return create(user)
}
