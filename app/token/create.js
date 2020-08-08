const { jwtConfig } = require('../config')
const jwt = require('jsonwebtoken')

function create (user) {
  const body = mapUserToBody(user)
  return jwt.sign(body, jwtConfig.secret, {
    expiresIn: `${jwtConfig.expiryInMinutes}m`
  })
}

function mapUserToBody (user) {
  return {
    userId: user.userId,
    scope: user.roles.map(x => x.Role.name)
  }
}

module.exports = create
