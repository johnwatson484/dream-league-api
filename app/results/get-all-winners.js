const { getCompleted } = require('../gameweeks')
const getSummary = require('./get-summary')

const getAllWinners = async () => {
  const gameweeks = await getCompleted()
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
