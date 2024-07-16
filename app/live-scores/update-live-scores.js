const { update } = require('../cache')

const updateLiveScores = async (msg) => {
  if (msg.content) {
    const match = JSON.parse(msg.content.toString())
    console.log('Score received:', match)
    const key = `${match.date}-${match.competition}-${match.homeTeam}-${match.awayTeam}`
    await update('live-scores', key, match)
  }
}

module.exports = {
  updateLiveScores,
}
