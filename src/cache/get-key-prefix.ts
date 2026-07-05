import config from '../config/index.ts'

export function getKeyPrefix (cache) {
  return `${config.get('cache.partition')}:${cache}`
}
