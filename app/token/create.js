const jwt = require('jsonwebtoken')
const { jwtConfig } = require('../config')

const create = (user) => {
  const body = mapUserToBody(user)
  return jwt.sign(body, jwtConfig.secret, {
    expiresIn: `${jwtConfig.expiryInMinutes}m`
  })
}

const mapUserToBody = (user) => {
  return {
    userId: user.userId,
    scope: user.roles.map(x => x.Role.name)
  }
}

module.exports = {
  create
}
