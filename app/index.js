require('log-timestamp')
const { start: startMessaging, stop: stopMessaging } = require('./messaging')
const { start: startServer } = require('./server')
const { SIGINT, SIGTERM } = require('./constants/signals')

process.on([SIGTERM, SIGINT], async () => {
  await stopMessaging()
  process.exit(0)
})

module.exports = (async () => {
  await startMessaging()
  await startServer()
})()
