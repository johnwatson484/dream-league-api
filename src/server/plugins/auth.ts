import config from '../../config/index.ts'
import { validate } from '../../token/validate.ts'

export default {
  plugin: {
    name: 'auth',
    register: (server, _options) => {
      server.auth.strategy('jwt', 'jwt', {
        key: config.jwtConfig.secret,
        validate,
        verifyOptions: { algorithms: ['HS256'] },
      })
      server.auth.default({ strategy: 'jwt', mode: 'try' })
    },
  },
}
