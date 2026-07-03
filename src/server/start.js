import { createServer } from './create-server.js'

export async function start () {
  const server = await createServer()
  await server.start()
  console.log(`Server started at http://localhost:${server.info.port}`)
}
