require('log-timestamp')
const { start: startCache, stop: stopCache } = require('./cache')
const { start: startServer } = require('./server')
const { SIGINT, SIGTERM } = require('./constants/signals')

process.on([SIGTERM, SIGINT], async () => {
  await stopCache()
  process.exit(0)
})

module.exports = (async () => {
  await startCache()
  await startServer()
})()
