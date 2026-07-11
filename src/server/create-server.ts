import Hapi from '@hapi/hapi'
import type { Server } from '@hapi/hapi'
import inert from '@hapi/inert'
import hapiAuthJwt2 from 'hapi-auth-jwt2'
import config from '../config/index.ts'
import { stop as stopCache } from '../cache/client.ts'
import auth from './plugins/auth.ts'
import errors from './plugins/errors.ts'
import router from './plugins/router.ts'
import logging from './plugins/logging.ts'
import pulse from './plugins/pulse.ts'
import headers from './plugins/headers.ts'

export async function createServer (): Promise<Server> {
  const server = Hapi.server({
    port: config.get('port'),
    routes: {
      validate: {
        options: {
          abortEarly: false,
        },
      },
    },
    router: {
      stripTrailingSlash: true,
    },
  })

  await server.register(inert)
  await server.register(hapiAuthJwt2)
  await server.register(auth)
  await server.register(headers)
  await server.register(errors)
  await server.register(router)
  await server.register(logging as any)
  await server.register(pulse)

  server.ext('onPostStop', async () => { await stopCache() })

  return server
}
