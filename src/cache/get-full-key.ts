import { getKeyPrefix } from './get-key-prefix.ts'

export function getFullKey (cache, key) {
  const prefix = getKeyPrefix(cache)
  return `${prefix}:${key}`
}
