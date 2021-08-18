const token = require('../token')
const { getUser } = require('./user-manager')
const bcrypt = require('bcrypt')

const login = async (email, password) => {
  const user = await getUser(email)

  if (user === null || !await bcrypt.compare(password, user.passwordHash)) {
    return false
  }

  return {
    token: token.create(user)
  }
}

module.exports = login
