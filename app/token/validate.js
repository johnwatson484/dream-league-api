const db = require('../data/models')

async function validate (decoded, request, h) {
  const user = await db.user.findOne({ where: { userId: decoded.userId } })
  if (user === undefined) {
    return { isValid: false }
  }
  return { isValid: true }
}

module.exports = validate
