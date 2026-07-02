import bcrypt from 'bcrypt'
import crypto from 'crypto'
import db from '../data/index.js'
import { sendResetPassword } from '../notifications/index.js'

const resetPassword = async (email) => {
  const user = await db.User.findOne({
    where: { email },
  })

  if (user === null) {
    return
  }

  const resetToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = await bcrypt.hash(resetToken, 10)
  user.resetToken = tokenHash

  const expirationDate = new Date()
  expirationDate.setHours(expirationDate.getHours() + 1)
  user.resetExpiresAt = expirationDate
  await user.save()

  await sendResetPassword(email, resetToken, user.userId)
}

const setNewPassword = async (userId, password, token) => {
  const user = await db.User.findByPk(userId)

  if (user === null) {
    throw new Error('Invalid user')
  }

  if (user.resetToken == null || user.resetExpiresAt < new Date() || !await bcrypt.compare(token, user.resetToken)) {
    throw new Error('Invalid token')
  }

  const passwordHash = await bcrypt.hash(password, 10)
  user.passwordHash = passwordHash
  user.resetToken = null
  user.resetExpiresAt = null
  await user.save()
}

export { resetPassword, setNewPassword }
