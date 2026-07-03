import config from '../config/index.js'
import { create } from '../token/index.js'
import { userExists, createUser, isMember } from './user-manager.js'

const register = async (email, password) => {
  if (await userExists(email)) {
    return false
  }

  if (!config.allowNonMemberRegistration && !await isMember(email)) {
    return false
  }

  const user = await createUser(email, password)

  return {
    token: create(user),
  }
}

export { register }
