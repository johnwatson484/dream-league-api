import db from '../data/index.ts'

export async function getExisting (gameweekId: number): Promise<{
  goals: { playerId: number; goals: number }[]
  goalsCup: { playerId: number; goals: number }[]
  conceded: { teamId: number; conceded: number }[]
  concededCup: { teamId: number; conceded: number }[]
}> {
  const [goals, goalsCup, conceded, concededCup] = await Promise.all([
    db.Goal.findAll({ where: { gameweekId, cup: false }, attributes: ['playerId'], raw: true }),
    db.Goal.findAll({ where: { gameweekId, cup: true }, attributes: ['playerId'], raw: true }),
    db.Concede.findAll({ where: { gameweekId, cup: false }, attributes: ['teamId'], raw: true }),
    db.Concede.findAll({ where: { gameweekId, cup: true }, attributes: ['teamId'], raw: true }),
  ])

  return {
    goals: aggregate(goals as any[], 'playerId'),
    goalsCup: aggregate(goalsCup as any[], 'playerId'),
    conceded: aggregateConceded(conceded as any[], 'teamId'),
    concededCup: aggregateConceded(concededCup as any[], 'teamId'),
  }
}

function aggregate (rows: { playerId: number }[], key: 'playerId'): { playerId: number; goals: number }[] {
  const counts = new Map<number, number>()
  for (const row of rows) {
    counts.set(row[key], (counts.get(row[key]) || 0) + 1)
  }
  return [...counts.entries()].map(([playerId, goals]) => ({ playerId, goals }))
}

function aggregateConceded (rows: { teamId: number }[], key: 'teamId'): { teamId: number; conceded: number }[] {
  const counts = new Map<number, number>()
  for (const row of rows) {
    counts.set(row[key], (counts.get(row[key]) || 0) + 1)
  }
  return [...counts.entries()].map(([teamId, conceded]) => ({ teamId, conceded }))
}
