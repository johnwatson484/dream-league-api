require('log-timestamp')
const { start: startMessaging, stop: stopMessaging } = require('./messaging')
const { start: startCache, stop: stopCache } = require('./cache')
const { start: startServer } = require('./server')
const { SIGINT, SIGTERM } = require('./constants/signals')

process.on([SIGTERM, SIGINT], async () => {
  // await stopCache()
  // await stopMessaging()
  process.exit(0)
})

module.exports = (async () => {
  // await startCache()
  // await startMessaging()
  await startServer()
})()
