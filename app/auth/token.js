const { jwtConfig } = require('../config')
const jwt = require('jsonwebtoken')

function get (user) {
  return jwt.sign(user, jwtConfig.secret, {
    expiresIn: `${jwtConfig.expiryInHours}h`
  })
}

module.exports = {
  get
}
