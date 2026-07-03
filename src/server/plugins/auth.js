import config from '../../config/index.js'
import { validate } from '../../token/validate.js'

export default {
  plugin: {
    name: 'auth',
    register: (server, _options) => {
      server.auth.strategy('jwt', 'jwt', {
        key: config.jwtConfig.secret,
        validate,
      })
      server.auth.default({ strategy: 'jwt', mode: 'try' })
    },
  },
}
