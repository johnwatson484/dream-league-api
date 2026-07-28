import db from '../data/index.ts'
import { getSummary } from './get-summary.ts'

export async function getAllWinners (): Promise<any[]> {
  const gameweeks = await db.Gameweek.findAll({ include: { model: db.Summary, as: 'summary', attributes: [], required: true } })
  const winners = []
  for (const gameweek of gameweeks as any[]) {
    const summary = await getSummary(gameweek.gameweekId)
    for (const winner of summary.winners) {
      const score = summary.scores.find((s: any) => s.managerId === winner.managerId)
      winners.push({
        gameweek: gameweek.gameweekId,
        name: winner.manager,
        managerId: winner.managerId,
        goals: score?.goals ?? winner.goals,
        conceded: score?.conceded ?? 0,
        margin: score?.margin ?? 0,
        result: score?.result ?? 'D',
        scorers: score?.scorers ?? [],
      })
    }
  }
  return winners
}
