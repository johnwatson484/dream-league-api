import db from '../data/index.ts'
import { getScores } from './get-scores.ts'
import { getCupScores } from './get-cup-scores.ts'
import { getTable } from './get-table.ts'
import { getWinners } from './get-winners.ts'
import { getGroups } from './get-groups.ts'

export async function createSummary (gameweekId: number): Promise<void> {
  const summary = await getSummary(gameweekId)
  await db.Summary.upsert({ gameweekId, summary })
}

async function getSummary (gameweekId: number): Promise<any> {
  const managers = await db.Manager.findAll()
  const scores = await getScores(gameweekId, managers)
  const winners = getWinners(scores)
  const table = await getTable(gameweekId, managers)
  const cupScores = await getCupScores(gameweekId, managers)
  const groups = await getGroups(gameweekId)

  return {
    gameweekId,
    scores,
    winners,
    table,
    cupScores,
    groups,
  }
}
