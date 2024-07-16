const { jwtConfig } = require('../../config')
const { validate } = require('../../token')

module.exports = {
  plugin: {
    name: 'auth',
    register: (server, _options) => {
      server.auth.strategy('jwt', 'jwt', {
        key: jwtConfig.secret,
        validate,
      })
      server.auth.default({ strategy: 'jwt', mode: 'try' })
    },
  },
}
