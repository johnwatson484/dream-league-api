const token = require('../token')
const { userExists, createUser } = require('./user-manager')

async function register (email, password) {
  if (await userExists(email)) {
    return false
  }

  const user = await createUser(email, password)

  return {
    token: await token.create(user)
  }
}

module.exports = register
