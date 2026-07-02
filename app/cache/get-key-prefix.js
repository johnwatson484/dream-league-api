import config from '../config/index.js'

const getKeyPrefix = (cache) => {
  return `${config.cache.partition}:${cache}`
}

export { getKeyPrefix }
