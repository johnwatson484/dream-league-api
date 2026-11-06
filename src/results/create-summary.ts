import db from '../data/index.ts'
import { getScores } from './get-scores.ts'
import { getCupScores } from './get-cup-scores.ts'
import { getTable } from './get-table.ts'
import { getWinners } from './get-winners.ts'
import { getGroups } from './get-groups.ts'
import { Op, type Transaction } from 'sequelize'
import { withResultsTransaction } from './transaction.ts'

export async function createSummary (gameweekId: number, transaction?: Transaction): Promise<void> {
  if (!transaction) {
    return withResultsTransaction(transaction => createSummary(gameweekId, transaction))
  }
  await saveSummary(gameweekId, transaction)
  await rebuildLaterSummaries(gameweekId, transaction)
}

export async function rebuildLaterSummaries (gameweekId: number, transaction: Transaction): Promise<void> {
  const summaries = await db.Summary.findAll({
    where: { gameweekId: { [Op.gt]: gameweekId } },
    attributes: ['gameweekId'],
    order: [['gameweekId', 'ASC']],
    transaction,
  })
  // Keep dependent summary writes sequential within the correction transaction.
  await summaries.reduce(async (previous, summary: any) => {
    await previous
    await saveSummary(summary.gameweekId, transaction)
  }, Promise.resolve())
}

async function saveSummary (gameweekId: number, transaction: Transaction): Promise<void> {
  const options = { transaction }
  const managers = await db.Manager.findAll(options)
  const summaries = await db.Summary.findAll({ ...options, attributes: ['gameweekId'] })
  const completedGameweekIds = [...new Set([...summaries.map((summary: any) => summary.gameweekId), gameweekId])]
  const scores = await getScores(gameweekId, managers, false, options)
  const winners = getWinners(scores)
  const table = await getTable(gameweekId, managers, { ...options, completedGameweekIds })
  const cupScores = await getCupScores(gameweekId, managers, options)
  const groups = await getGroups(gameweekId, options)

  const summary = {
    gameweekId,
    scores,
    winners,
    table,
    cupScores,
    groups,
  }
  await db.Summary.upsert({ gameweekId, summary }, options)
}
