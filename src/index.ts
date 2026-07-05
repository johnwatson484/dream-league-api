import 'log-timestamp'
import { start as startCache, stop as stopCache } from './cache/client.ts'
import { start as startServer } from './server/start.ts'

const shutdown = async (): Promise<void> => {
  await stopCache()
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

await startCache()
await startServer()
