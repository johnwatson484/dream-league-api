import { createClient } from 'redis'
import config from '../config/index.js'
import { getFullKey } from './get-full-key.js'
import { getKeyPrefix } from './get-key-prefix.js'

let client

export async function start () {
  client = createClient({ socket: config.cache.socket, password: config.cache.password })
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
  console.log(`Setting cache key ${fullKey} with expiry ${config.cache.ttl} as ${serializedValue}`)
  await client.set(fullKey, serializedValue, { EX: config.cache.ttl })
}
