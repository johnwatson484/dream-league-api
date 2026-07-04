import { getUserById } from '../account/user-manager.ts'

export async function validate (decoded, _request, _h) {
  const user = await getUserById(decoded.userId)

  if (user === null) {
    return { isValid: false }
  }

  if (decoded.tokenVersion === undefined || decoded.tokenVersion !== user.tokenVersion) {
    return { isValid: false }
  }

  return {
    isValid: true,
    credentials: {
      userId: user.userId,
      scope: user.roles.map(x => x.Role ? x.Role.name : x.name),
    },
  }
}
