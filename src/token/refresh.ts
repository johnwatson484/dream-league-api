import { randomBytes, createHash } from 'node:crypto'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import config from '../config/index.ts'
import { privateKey } from '../config/keys.ts'
import { getUserById } from '../account/user-manager.ts'
import db from '../data/index.ts'
import { mapRoles } from './map-roles.ts'

export async function refresh (rawRefreshToken: string) {
  const tokenHash = createHash('sha256').update(rawRefreshToken).digest('hex')

  const storedToken = await db.RefreshToken.findOne({
    where: { tokenHash },
  })

  if (!storedToken) {
    return null
  }

  if ((storedToken as any).revokedAt) {
    await revokeFamily((storedToken as any).family)
    return null
  }

  if (new Date((storedToken as any).expiresAt) < new Date()) {
    return null
  }

  const maxAgeMs = config.get('jwt.refreshTokenMaxAgeDays') * 24 * 60 * 60 * 1000
  if (new Date((storedToken as any).familyCreatedAt).getTime() + maxAgeMs < Date.now()) {
    await revokeFamily((storedToken as any).family)
    return null
  }

  const user = await getUserById((storedToken as any).userId)

  if (!user) {
    return null
  }

  await (storedToken as any).update({ revokedAt: new Date() })

  const accessToken = jwt.sign({
    userId: user.userId,
    scope: mapRoles(user.roles),
    tokenVersion: user.tokenVersion,
  }, privateKey, {
    algorithm: 'RS256',
    expiresIn: `${config.get('jwt.expiryInMinutes')}m`,
  })

  const newRawToken = randomBytes(32).toString('hex')
  const newTokenHash = createHash('sha256').update(newRawToken).digest('hex')
  const expiresAt = new Date(Date.now() + config.get('jwt.refreshTokenExpiryDays') * 24 * 60 * 60 * 1000)

  await db.RefreshToken.create({
    userId: (storedToken as any).userId,
    tokenHash: newTokenHash,
    family: (storedToken as any).family,
    expiresAt,
    familyCreatedAt: (storedToken as any).familyCreatedAt,
  })

  return { accessToken, refreshToken: newRawToken }
}

export async function revokeToken (rawRefreshToken: string): Promise<void> {
  const tokenHash = createHash('sha256').update(rawRefreshToken).digest('hex')

  const storedToken = await db.RefreshToken.findOne({
    where: { tokenHash },
  })

  if (storedToken) {
    await revokeFamily((storedToken as any).family)
  }
}

async function revokeFamily (family: string): Promise<void> {
  await db.RefreshToken.update(
    { revokedAt: new Date() },
    { where: { family, revokedAt: { [Op.is]: null } } }
  )
}
