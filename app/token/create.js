const { jwtConfig } = require('../config')
const jwt = require('jsonwebtoken')

function create (user) {
  const body = mapUserToBody(user)
  console.log(body)
  return jwt.sign(body, jwtConfig.secret, {
    expiresIn: `${jwtConfig.expiryInMinutes}m`
  })
}

function mapUserToBody (user) {
  console.log(user)
  return {
    userId: user.userId
  }
}

module.exports = create
