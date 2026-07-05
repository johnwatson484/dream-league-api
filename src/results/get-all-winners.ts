import db from '../data/index.ts'
import { getSummary } from './get-summary.ts'

export async function getAllWinners (): Promise<any[]> {
  const gameweeks = await db.Gameweek.findAll({ include: { model: db.Summary, as: 'summary', attributes: [], required: true } })
  const winners = []
  for (const gameweek of gameweeks as any[]) {
    const summary = await getSummary(gameweek.gameweekId)
    for (const winner of summary.winners) {
      winners.push({ gameweek: gameweek.gameweekId, name: winner.manager })
    }
  }
  return winners
}
