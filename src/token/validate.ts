import { getUserById } from '../account/user-manager.ts'

export async function validate (decoded: any, _request: any, _h: any) {
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
      scope: user.roles.map((x: any) => x.Role ? x.Role.name : x.name),
    },
  }
}
