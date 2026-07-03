import db from '../data/index.js'

export async function validate (decoded, _request, _h) {
  const user = await db.User.findOne({
    raw: true,
    where: { userId: decoded.userId },
  })
  if (user === null) {
    return { isValid: false }
  }
  return { isValid: true }
}
