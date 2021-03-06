const token = require('../token')
const { getUser } = require('../account')
const bcrypt = require('bcrypt')

async function login (email, password) {
  const user = await getUser(email)

  if (user === null || !await bcrypt.compare(password, user.passwordHash)) {
    return false
  }

  return {
    token: token.create(user)
  }
}

module.exports = login
