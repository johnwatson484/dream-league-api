const { getKeys, get } = require('../cache')
const { sortArray } = require('../utils/sort-array')

const getLiveScores = async () => {
  const matches = []
  const matchKeys = await getKeys('live-scores')
  for (const key of matchKeys) {
    const match = await get('live-scores', key)
    matches.push(match)
  }
  return matches.sort((a, b) => { return sortArray(b.date, a.date) || sortArray(a.competition, b.competition) || sortArray(a.homeTeam, b.homeTeam) })
}

module.exports = {
  getLiveScores
}
