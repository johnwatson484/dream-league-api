const hapi = require('@hapi/hapi')
const config = require('./config')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })

  // Register the plugins
  await server.register(require('@hapi/inert'))
  await server.register(require('hapi-auth-jwt2'))
  await server.register(require('./plugins/auth'))
  await server.register(require('./plugins/router'))
  await server.register(require('blipp'))

  return server
}

module.exports = createServer
