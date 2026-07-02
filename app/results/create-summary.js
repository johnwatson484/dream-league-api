import db from '../data/index.js'
import { getScores } from './get-scores.js'
import { getCupScores } from './get-cup-scores.js'
import { getTable } from './get-table.js'
import { getWinners } from './get-winners.js'
import { getGroups } from './get-groups.js'

const createSummary = async (gameweekId) => {
  const summary = await getSummary(gameweekId)
  await db.Summary.upsert({ gameweekId, summary })
}

const getSummary = async (gameweekId) => {
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

export { createSummary }
