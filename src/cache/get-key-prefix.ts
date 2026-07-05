import config from '../config/index.ts'

export function getKeyPrefix (cache: string): string {
  return `${config.get('cache.partition')}:${cache}`
}
