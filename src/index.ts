import { start as startCache } from './cache/client.ts'
import { start as startServer } from './server/start.ts'

await startCache()
await startServer()
