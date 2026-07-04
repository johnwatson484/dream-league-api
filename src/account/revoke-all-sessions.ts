import { Op } from 'sequelize'
import db from '../data/index.ts'

export async function revokeAllSessions (userId) {
  await db.User.update(
    { tokenVersion: db.sequelize.literal('"tokenVersion" + 1') },
    { where: { userId } }
  )

  await db.RefreshToken.update(
    { revokedAt: new Date() },
    { where: { userId, revokedAt: { [Op.is]: null } } }
  )
}
