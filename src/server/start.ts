import { createServer } from './create-server.ts'
import logger from '../logger.ts'

export async function start (): Promise<void> {
  const server = await createServer()
  await server.start()
  logger.info(`Server started at http://localhost:${server.info.port}`)
}
