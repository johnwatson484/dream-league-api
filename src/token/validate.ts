import { getUserById } from '../account/user-manager.ts'
import { mapRoles } from './map-roles.ts'

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
      scope: mapRoles(user.roles),
    },
  }
}
