import db from '../data/index.ts'
import type { Transactionable } from 'sequelize'

export async function getGoals (gameweekId: number, managerId: number, cup: boolean = false, options: Transactionable = {}): Promise<any> {
  return db.Goal.findAll({ ...options, where: { managerId, gameweekId, cup } })
}

export async function getConceded (gameweekId: number, managerId: number, cup: boolean = false, options: Transactionable = {}): Promise<any> {
  return db.Concede.findAll({ ...options, where: { managerId, gameweekId, cup } })
}
