import { publicKey } from '../../config/keys.ts'
import { validate } from '../../token/validate.ts'

export default {
  plugin: {
    name: 'auth',
    register: (server, _options) => {
      server.auth.strategy('jwt', 'jwt', {
        key: publicKey,
        validate,
        verifyOptions: { algorithms: ['RS256'] },
      })
      server.auth.default({ strategy: 'jwt', mode: 'required' })
    },
  },
}
