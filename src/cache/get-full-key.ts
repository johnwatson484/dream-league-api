import { getKeyPrefix } from './get-key-prefix.ts'

export function getFullKey (cache: string, key: string): string {
  const prefix = getKeyPrefix(cache)
  return `${prefix}:${key}`
}
