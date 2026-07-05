import db from '../data/index.ts'

export async function getSummary (gameweekId = 0): Promise<any> {
  if (gameweekId === 0) {
    gameweekId = await db.Summary.max('gameweekId') ?? 0
  }
  const summary: any = await db.Summary.findOne({ where: { gameweekId }, raw: true }) ?? {}
  return summary.summary
}
