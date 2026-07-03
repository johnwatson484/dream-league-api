import { createServer } from './create-server.js'

const start = async () => {
  const server = await createServer()
  await server.start()
}

export { start }
