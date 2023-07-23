const { createClient } = require('redis')
const { cache: config } = require('../config')
const { getFullKey } = require('./get-full-key')

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

const get = async (cache, key) => {
  const fullKey = getFullKey(cache, key)
  const value = await client.get(fullKey)
  return value ? JSON.parse(value) : {}
}

const set = async (cache, key, value) => {
  const fullKey = getFullKey(cache, key)
  const serializedValue = JSON.stringify(value)
  await client.set(fullKey, serializedValue, { EX: config.ttl })
}

module.exports = {
  start,
  stop,
  get,
  set
}
