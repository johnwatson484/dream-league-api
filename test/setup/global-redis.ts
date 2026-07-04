import { GenericContainer, Wait } from 'testcontainers'

export async function setup () {
  const redis = await new GenericContainer('redis:6')
    .withExposedPorts(6379)
    .withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))
    .start()

  process.env.REDIS_HOST = redis.getHost()
  process.env.REDIS_PORT = String(redis.getMappedPort(6379))
  process.env.NODE_ENV = 'test'

  return async function teardown () {
    await redis.stop()
  }
}
