const token = require('../token')
const { userExists, createUser } = require('./user-manager')

async function register (email, password) {
  if (await userExists(email)) {
    return {
      success: false,
      message: 'user already exists'
    }
  }

  const user = await createUser(email, password)

  return {
    success: true,
    token: await token.create(user)
  }
}

module.exports = register
