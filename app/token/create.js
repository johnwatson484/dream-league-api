const { jwtConfig } = require('../config')
const jwt = require('jsonwebtoken')

function create (obj) {
  return jwt.sign(obj, jwtConfig.secret, {
    expiresIn: jwtConfig.expiryInMinutes
  })
}

module.exports = create
