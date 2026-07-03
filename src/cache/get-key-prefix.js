import config from '../config/index.js'

export function getKeyPrefix (cache) {
  return `${config.cache.partition}:${cache}`
}
