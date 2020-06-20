const db = require('../data/models')

async function validate (decoded, request, h) {
  const user = await db.user.findOne({
    raw: true,
    where: { userId: decoded.userId }
  })
  if (user === null) {
    return { isValid: false }
  }
  return { isValid: true }
}

module.exports = validate
