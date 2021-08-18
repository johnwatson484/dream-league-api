const db = require('../data')

const validate = async (decoded, request, h) => {
  const user = await db.User.findOne({
    raw: true,
    where: { userId: decoded.userId }
  })
  if (user === null) {
    return { isValid: false }
  }
  return { isValid: true }
}

module.exports = validate
