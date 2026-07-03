import db from '../data/index.js'
import { getSummary } from './get-summary.js'

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

export { getAllWinners }
