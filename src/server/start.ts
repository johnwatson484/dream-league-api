import { createServer } from './create-server.ts'

export async function start (): Promise<void> {
  const server = await createServer()
  await server.start()
  console.log(`Server started at http://localhost:${server.info.port}`)
}
