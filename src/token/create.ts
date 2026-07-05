import { randomBytes, createHash, randomUUID } from 'node:crypto'
import jwt from 'jsonwebtoken'
import config from '../config/index.ts'
import { privateKey } from '../config/keys.ts'
import db from '../data/index.ts'
import { mapRoles } from './map-roles.ts'

export async function create (user: any) {
  const accessToken = jwt.sign(mapUserToBody(user), privateKey, {
    algorithm: 'RS256',
    expiresIn: `${config.get('jwt.expiryInMinutes')}m`,
  })

  const { rawToken, tokenHash, family, expiresAt } = generateRefreshToken()

  await db.RefreshToken.create({
    userId: user.userId,
    tokenHash,
    family,
    expiresAt,
    familyCreatedAt: new Date(),
  })

  const roles = mapRoles(user.roles)
  return { accessToken, refreshToken: rawToken, userId: user.userId, roles }
}

function mapUserToBody (user: any): object {
  return {
    userId: user.userId,
    scope: mapRoles(user.roles),
    tokenVersion: user.tokenVersion ?? 0,
  }
}

function generateRefreshToken () {
  const rawToken = randomBytes(32).toString('hex')
  const tokenHash = createHash('sha256').update(rawToken).digest('hex')
  const family = randomUUID()
  const expiresAt = new Date(Date.now() + config.get('jwt.refreshTokenExpiryDays') * 24 * 60 * 60 * 1000)

  return { rawToken, tokenHash, family, expiresAt }
}

export function hashToken (token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
