import Hapi from '@hapi/hapi'
import inert from '@hapi/inert'
import hapiAuthJwt2 from 'hapi-auth-jwt2'
import config from '../config/index.ts'
import auth from './plugins/auth.ts'
import errors from './plugins/errors.ts'
import router from './plugins/router.ts'
import logging from './plugins/logging.ts'
import headers from './plugins/headers.ts'

export async function createServer () {
  const server = Hapi.server({
    port: config.port,
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
  return server
}
