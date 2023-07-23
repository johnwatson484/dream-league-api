const { createServer } = require('./create-server')

const start = async () => {
  const server = await createServer()
  await server.start()
}

module.exports = {
  start
}
