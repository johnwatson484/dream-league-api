const { getKeys, get } = require('../cache')

const getLiveScores = async () => {
  const matches = []
  const matchKeys = await getKeys('live-scores')
  for (const key of matchKeys) {
    matches.push(await get('live-scores', key))
  }
  return matches
}

module.exports = {
  getLiveScores
}
