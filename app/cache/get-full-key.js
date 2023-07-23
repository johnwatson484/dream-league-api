const { getKeyPrefix } = require('./get-key-prefix')

const getFullKey = (cache, key) => {
  const prefix = getKeyPrefix(cache)
  return `${prefix}:${key}`
}

module.exports = {
  getFullKey
}
