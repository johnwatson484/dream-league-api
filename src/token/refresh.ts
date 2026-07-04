import { randomBytes, createHash } from 'node:crypto'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import config from '../config/index.ts'
import { privateKey } from '../config/keys.ts'
import { getUserById } from '../account/user-manager.ts'
import db from '../data/index.ts'

export async function refresh (rawRefreshToken) {
  const tokenHash = createHash('sha256').update(rawRefreshToken).digest('hex')

  const storedToken = await db.RefreshToken.findOne({
    where: { tokenHash },
  })

  if (!storedToken) {
    return null
  }

  if (storedToken.revokedAt) {
    await revokeFamily(storedToken.family)
    return null
  }

  if (new Date(storedToken.expiresAt) < new Date()) {
    return null
  }

  const maxAgeMs = config.jwtConfig.refreshTokenMaxAgeDays * 24 * 60 * 60 * 1000
  if (new Date(storedToken.familyCreatedAt).getTime() + maxAgeMs < Date.now()) {
    await revokeFamily(storedToken.family)
    return null
  }

  const user = await getUserById(storedToken.userId)

  if (!user) {
    return null
  }

  await storedToken.update({ revokedAt: new Date() })

  const accessToken = jwt.sign({
    userId: user.userId,
    scope: user.roles.map(x => x.Role ? x.Role.name : x.name),
    tokenVersion: user.tokenVersion,
  }, privateKey, {
    algorithm: 'RS256',
    expiresIn: `${config.jwtConfig.expiryInMinutes}m`,
  })

  const newRawToken = randomBytes(32).toString('hex')
  const newTokenHash = createHash('sha256').update(newRawToken).digest('hex')
  const expiresAt = new Date(Date.now() + config.jwtConfig.refreshTokenExpiryDays * 24 * 60 * 60 * 1000)

  await db.RefreshToken.create({
    userId: user.userId,
    tokenHash: newTokenHash,
    family: storedToken.family,
    expiresAt,
    familyCreatedAt: storedToken.familyCreatedAt,
  })

  return { accessToken, refreshToken: newRawToken }
}

export async function revokeToken (rawRefreshToken) {
  const tokenHash = createHash('sha256').update(rawRefreshToken).digest('hex')

  const storedToken = await db.RefreshToken.findOne({
    where: { tokenHash },
  })

  if (storedToken) {
    await revokeFamily(storedToken.family)
  }
}

async function revokeFamily (family) {
  await db.RefreshToken.update(
    { revokedAt: new Date() },
    { where: { family, revokedAt: { [Op.is]: null } } }
  )
}
