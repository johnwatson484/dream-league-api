const bcrypt = require('bcrypt')
const { getUser } = require('./user-manager')
const { create } = require('../token')

const login = async (email, password) => {
  const user = await getUser(email)

  if (user === null || !await bcrypt.compare(password, user.passwordHash)) {
    return false
  }

  return {
    token: create(user)
  }
}

module.exports = {
  login
}
