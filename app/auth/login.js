const token = require('../token')
const boom = require('@hapi/boom')
const { getUser } = require('../account')
const bcrypt = require('bcrypt')

async function login (email, password) {
  const user = await getUser(email)

  if (user === null) {
    return boom.unauthorized()
  }

  if (!await bcrypt.compare(password, user.passwordHash)) {
    return boom.unauthorized()
  }

  return {
    success: true,
    token: token.create(user)
  }
}

module.exports = login
