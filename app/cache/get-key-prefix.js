const { cache: config } = require('../config')

const getKeyPrefix = (cache) => {
  return `${config.partition}:${cache}`
}

module.exports = {
  getKeyPrefix
}
