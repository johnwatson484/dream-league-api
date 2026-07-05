import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import db from '../data/index.ts'
import { sendResetPassword } from '../notifications/send-reset-password.ts'
import { revokeAllSessions } from './revoke-all-sessions.ts'

export async function resetPassword (email: string): Promise<void> {
  const user = await db.User.findOne({
    where: { email },
  })

  if (user === null) {
    return
  }

  const resetToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = await bcrypt.hash(resetToken, 10)
  ;(user as any).resetToken = tokenHash

  const expirationDate = new Date()
  expirationDate.setHours(expirationDate.getHours() + 1)
  ;(user as any).resetExpiresAt = expirationDate
  await (user as any).save()

  await sendResetPassword(email, resetToken, (user as any).userId)
}

export async function setNewPassword (userId: number, password: string, token: string): Promise<void> {
  const user = await db.User.findByPk(userId)

  if (user === null) {
    throw new Error('Invalid user')
  }

  if ((user as any).resetToken == null || (user as any).resetExpiresAt < new Date() || !await bcrypt.compare(token, (user as any).resetToken)) {
    throw new Error('Invalid token')
  }

  const passwordHash = await bcrypt.hash(password, 10)
  ;(user as any).passwordHash = passwordHash
  ;(user as any).resetToken = null
  ;(user as any).resetExpiresAt = null
  await (user as any).save()

  await revokeAllSessions((user as any).userId)
}
