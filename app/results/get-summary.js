const db = require('../data')

const getSummary = async (gameweekId = 0) => {
  if (gameweekId === 0) {
    gameweekId = await db.Summary.max('gameweekId') ?? 0
  }
  const summary = await db.Summary.findOne({ where: { gameweekId }, raw: true }) ?? {}
  return summary.summary
}

module.exports = {
  getSummary,
}
