const hoek = require('@hapi/hoek')
const { get, set } = require('./client')

const update = async (cache, key, cacheData) => {
  const existing = await get(cache, key)
  hoek.merge(existing, cacheData, { mergeArrays: true })
  await set(cache, key, existing)
}

module.exports = {
  update
}
