import 'log-timestamp'
import { start as startCache, stop as stopCache } from './cache/client.js'
import { start as startServer } from './server/start.js'
import { SIGINT, SIGTERM } from './constants/signals.js'

process.on([SIGTERM, SIGINT], async () => {
  await stopCache()
  process.exit(0)
})

await startCache()
await startServer()
