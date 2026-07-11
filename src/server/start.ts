import { createServer } from './create-server.ts'

export async function start (): Promise<void> {
  const server = await createServer()
  await server.start()
  server.log(['info'], `Server started at ${server.info.uri}`)
}
