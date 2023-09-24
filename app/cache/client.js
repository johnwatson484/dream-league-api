const { createClient } = require('redis')
const { cache: config } = require('../config')
const { getFullKey } = require('./get-full-key')
const { getKeyPrefix } = require('./get-key-prefix')

let client

const start = async () => {
  client = createClient({ socket: config.socket, password: config.password })
  client.on('error', (err) => console.log(`Redis error: ${err}`))
  client.on('reconnecting', () => console.log('Redis reconnecting...'))
  client.on('ready', () => console.log('Redis connected'))
  await client.connect()
}

const stop = async () => {
  if (client.isOpen) {
    await client.quit()
  }
}

const getKeys = async (cache) => {
  const prefix = getKeyPrefix(cache)
  const keys = await client.keys(`${prefix}:*`)
  return keys.map((key) => key.replace(`${prefix}:`, ''))
}

const get = async (cache, key) => {
  const fullKey = getFullKey(cache, key)
  const value = await client.get(fullKey)
  return value ? JSON.parse(value) : {}
}

const set = async (cache, key, value) => {
  const fullKey = getFullKey(cache, key)
  const serializedValue = JSON.stringify(value)
  console.log(`Setting cache key ${fullKey} with expiry ${config.ttl} as ${serializedValue}`)
  await client.set(fullKey, serializedValue, { EX: config.ttl })
}

module.exports = {
  start,
  stop,
  getKeys,
  get,
  set
}
