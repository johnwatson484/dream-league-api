import config from '../config/index.ts'

export function getKeyPrefix (cache) {
  return `${config.cache.partition}:${cache}`
}
