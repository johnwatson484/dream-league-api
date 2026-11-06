import type { Transaction } from 'sequelize'
import db from '../data/index.ts'

export async function withResultsTransaction<T> (work: (transaction: Transaction) => Promise<T>): Promise<T> {
  return db.sequelize.transaction(async transaction => {
    // Serialize result changes before reading scores or rebuilding cumulative tables.
    // Ordinary SELECTs remain available and see the last committed results.
    await db.sequelize.query('LOCK TABLE "summaries" IN SHARE ROW EXCLUSIVE MODE', { transaction })
    return work(transaction)
  })
}
