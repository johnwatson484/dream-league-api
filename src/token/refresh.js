import bcrypt from 'bcrypt'
import db from '../data/index.js'
import { getUserById } from '../account/user-manager.js'
import { create } from './create.js'

export async function refresh (userId, rawRefreshToken) {
  const user = await db.User.findOne({ raw: true, where: { userId } })

  if (!user || !user.refreshToken || !user.refreshTokenExpiresAt) {
    return false
  }

  if (new Date() > new Date(user.refreshTokenExpiresAt)) {
    return false
  }

  if (!await bcrypt.compare(rawRefreshToken, user.refreshToken)) {
    return false
  }

  const fullUser = await getUserById(userId)
  return create(fullUser)
}

export async function revoke (userId) {
  await db.User.update(
    { refreshToken: null, refreshTokenExpiresAt: null },
    { where: { userId } },
  )
}
