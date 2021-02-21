const db = require('../../data/models')

async function getSummary (gameweekId) {
  if (!gameweekId) {
    gameweekId = await db.Summary.max('gameweekId') || 0
  }
  const summary = await db.Summary.findOne({ where: { gameweekId }, raw: true }) || {}
  return summary.summary
}

module.exports = getSummary
