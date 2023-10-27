const { getKeys, get } = require('../cache')

const getLiveScores = async () => {
  const matches = []
  const matchKeys = await getKeys('live-scores')
  for (const key of matchKeys) {
    const match = await get('live-scores', key)
    matches.push(match)
  }
  return matches
}

module.exports = {
  getLiveScores
}
