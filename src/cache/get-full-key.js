import { getKeyPrefix } from './get-key-prefix.js'

const getFullKey = (cache, key) => {
  const prefix = getKeyPrefix(cache)
  return `${prefix}:${key}`
}

export { getFullKey }
