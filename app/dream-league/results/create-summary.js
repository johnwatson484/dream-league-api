const db = require('../../data/models')
const getScores = require('./get-scores')
const getCupScores = require('./get-cup-scores')
const getTable = require('./get-table')

async function createSummary (gameweekId) {
  const summary = await getSummary(gameweekId)
  await db.Summary.upsert({ gameweekId, summary })
}

async function getSummary (gameweekId) {
  const managers = await db.Manager.findAll()
  const scores = await getScores(gameweekId, managers)
  const table = await getTable(gameweekId, managers)
  const cupScores = await getCupScores(gameweekId, managers)

  return {
    gameweekId,
    scores,
    cupScores,
    table
  }
}

module.exports = createSummary
