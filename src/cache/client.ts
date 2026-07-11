import { createClient } from 'redis'
import config from '../config/index.ts'
import logger from '../logger.ts'

let client: ReturnType<typeof createClient>

function getKeyPrefix (cache: string): string {
  return `${config.get('cache.partition')}:${cache}`
}

function getFullKey (cache: string, key: string): string {
  return `${getKeyPrefix(cache)}:${key}`
}

export async function start (): Promise<void> {
  const password = config.get('cache.password')
  client = createClient({
    socket: {
      host: config.get('cache.host'),
      port: config.get('cache.port'),
      tls: config.get('cache.tls'),
    },
    ...(password ? { password } : {}),
  })
  client.on('error', (err: unknown) => logger.error(`Redis error: ${err}`))
  client.on('reconnecting', () => logger.info('Redis reconnecting...'))
  client.on('ready', () => logger.info('Redis connected'))
  await client.connect()
}

export async function stop (): Promise<void> {
  if (client.isOpen) {
    await client.quit()
  }
}

export async function getKeys (cache: string): Promise<string[]> {
  const prefix = getKeyPrefix(cache)
  const keys = await client.keys(`${prefix}:*`)
  return keys.map((key) => key.replace(`${prefix}:`, ''))
}

export async function get (cache: string, key: string): Promise<any> {
  const fullKey = getFullKey(cache, key)
  const value = await client.get(fullKey)
  return value ? JSON.parse(value) : {}
}

export async function set (cache: string, key: string, value: any): Promise<void> {
  const fullKey = getFullKey(cache, key)
  const serializedValue = JSON.stringify(value)
  await client.set(fullKey, serializedValue, { EX: config.get('cache.ttl') })
}
