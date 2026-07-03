import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../data/index.js'
import config from '../config/index.js'

export async function create (user) {
  const accessToken = jwt.sign(mapUserToBody(user), config.jwtConfig.secret, {
    expiresIn: `${config.jwtConfig.expiryInMinutes}m`,
  })

  const rawRefreshToken = crypto.randomBytes(32).toString('hex')
  const refreshTokenHash = await bcrypt.hash(rawRefreshToken, 10)
  const refreshTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  await db.User.update(
    { refreshToken: refreshTokenHash, refreshTokenExpiresAt },
    { where: { userId: user.userId } },
  )

  return { token: accessToken, refreshToken: rawRefreshToken, userId: user.userId }
}

function mapUserToBody (user) {
  return {
    userId: user.userId,
    scope: user.roles.map(x => x.Role.name),
  }
}
