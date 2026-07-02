import { cache as config } from '../config/index.js'

const getKeyPrefix = (cache) => {
  return `${config.partition}:${cache}`
}

export { getKeyPrefix }
