const { jwt } = require('../config')
const validate = require('../auth')

module.exports = {
  plugin: {
    name: 'auth',
    register: (server, options) => {
      server.auth.strategy('jwt', 'jwt', {
        key: jwt.secret,
        validate
      })
      server.auth.default('jwt')
    }
  }
}
