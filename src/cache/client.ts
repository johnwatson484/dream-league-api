import { createClient } from 'redis'
import config from '../config/index.ts'
import { getFullKey } from './get-full-key.ts'
import { getKeyPrefix } from './get-key-prefix.ts'

let client

export async function start () {
  client = createClient({
    socket: {
      host: config.get('cache.host'),
      port: config.get('cache.port'),
      tls: config.get('cache.tls'),
    },
    password: config.get('cache.password') || undefined,
  })
  client.on('error', (err) => console.log(`Redis error: ${err}`))
  client.on('reconnecting', () => console.log('Redis reconnecting...'))
  client.on('ready', () => console.log('Redis connected'))
  await client.connect()
}

export async function stop () {
  if (client.isOpen) {
    await client.quit()
  }
}

export async function getKeys (cache) {
  const prefix = getKeyPrefix(cache)
  const keys = await client.keys(`${prefix}:*`)
  return keys.map((key) => key.replace(`${prefix}:`, ''))
}

export async function get (cache, key) {
  const fullKey = getFullKey(cache, key)
  const value = await client.get(fullKey)
  return value ? JSON.parse(value) : {}
}

export async function set (cache, key, value) {
  const fullKey = getFullKey(cache, key)
  const serializedValue = JSON.stringify(value)
  await client.set(fullKey, serializedValue, { EX: config.get('cache.ttl') })
}
