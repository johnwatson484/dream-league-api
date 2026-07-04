import { randomBytes, createHash } from 'node:crypto'
import { randomUUID } from 'node:crypto'
import jwt from 'jsonwebtoken'
import config from '../config/index.ts'
import { privateKey } from '../config/keys.ts'
import db from '../data/index.ts'

export async function create (user) {
  const accessToken = jwt.sign(mapUserToBody(user), privateKey, {
    algorithm: 'RS256',
    expiresIn: `${config.jwtConfig.expiryInMinutes}m`,
  })

  const { rawToken, tokenHash, family, expiresAt } = generateRefreshToken()

  await db.RefreshToken.create({
    userId: user.userId,
    tokenHash,
    family,
    expiresAt,
  })

  const roles = user.roles.map(x => x.Role ? x.Role.name : x.name)
  return { accessToken, refreshToken: rawToken, userId: user.userId, roles }
}

function mapUserToBody (user) {
  return {
    userId: user.userId,
    scope: user.roles.map(x => x.Role ? x.Role.name : x.name),
    tokenVersion: user.tokenVersion ?? 0,
  }
}

function generateRefreshToken () {
  const rawToken = randomBytes(32).toString('hex')
  const tokenHash = createHash('sha256').update(rawToken).digest('hex')
  const family = randomUUID()
  const expiresAt = new Date(Date.now() + config.jwtConfig.refreshTokenExpiryDays * 24 * 60 * 60 * 1000)

  return { rawToken, tokenHash, family, expiresAt }
}

export function hashToken (token) {
  return createHash('sha256').update(token).digest('hex')
}
