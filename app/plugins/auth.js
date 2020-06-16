const { jwtConfig } = require('../config')
const { validate } = require('../auth')

module.exports = {
  plugin: {
    name: 'auth',
    register: (server, options) => {
      server.auth.strategy('jwt', 'jwt', {
        key: jwtConfig.secret,
        validate
      })
    }
  }
}
