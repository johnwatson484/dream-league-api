import config from '../config/index.ts'
import { create } from '../token/create.ts'
import { userExists, createUser, isMember } from './user-manager.ts'

export async function register (email: string, password: string) {
  if (await userExists(email)) {
    return false
  }

  if (!config.get('allowNonMemberRegistration') && !await isMember(email)) {
    return false
  }

  const user = await createUser(email, password)

  return create(user)
}
