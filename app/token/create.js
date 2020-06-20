const { jwtConfig } = require('../config')
const jwt = require('jsonwebtoken')

function create (user) {
  return jwt.sign(user, jwtConfig.secret, {
    expiresIn: jwtConfig.expiryInMinutes
  })
}

module.exports = create
