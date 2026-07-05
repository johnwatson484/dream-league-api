import db from '../data/index.ts'

export async function getGoals (gameweekId: number, managerId: number, cup: boolean = false): Promise<any> {
  return db.Goal.findAll({ where: { managerId, gameweekId, cup } })
}

export async function getConceded (gameweekId: number, managerId: number, cup: boolean = false): Promise<any> {
  return db.Concede.findAll({ where: { managerId, gameweekId, cup } })
}
