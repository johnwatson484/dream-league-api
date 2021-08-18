const db = require('../data')
const getSummary = require('./get-summary')

const getAllWinners = async () => {
  const gameweeks = await db.Gameweek.findAll({ include: { model: db.Summary, as: 'summary', attributes: [], required: true } })
  const winners = []
  for (const gameweek of gameweeks) {
    const summary = await getSummary(gameweek.gameweekId)
    for (const winner of summary.winners) {
      winners.push({ gameweek: gameweek.gameweekId, name: winner.manager })
    }
  }
  return winners
}

module.exports = getAllWinners
