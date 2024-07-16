const { allowNonMemberRegistration } = require('../config')
const { create } = require('../token')
const { userExists, createUser, isMember } = require('./user-manager')

const register = async (email, password) => {
  if (await userExists(email)) {
    return false
  }

  if (!allowNonMemberRegistration && !await isMember(email)) {
    return false
  }

  const user = await createUser(email, password)

  return {
    token: create(user),
  }
}

module.exports = {
  register,
}
