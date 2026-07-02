import { jwtConfig } from '../../config/index.js'
import { validate } from '../../token/index.js'

export default {
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
