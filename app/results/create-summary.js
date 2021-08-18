const db = require('../data')
const getScores = require('./get-scores')
const getCupScores = require('./get-cup-scores')
const getTable = require('./get-table')
const getWinners = require('./get-winners')
const getGroups = require('./get-groups')

async function createSummary (gameweekId) {
  const summary = await getSummary(gameweekId)
  await db.Summary.upsert({ gameweekId, summary })
}

async function getSummary (gameweekId) {
  const managers = await db.Manager.findAll()
  const scores = await getScores(gameweekId, managers)
  const winners = getWinners(scores)
  const table = await getTable(gameweekId, managers)
  const cupScores = await getCupScores(gameweekId, managers)
  const groups = await getGroups(gameweekId, managers)

  return {
    gameweekId,
    scores,
    winners,
    table,
    cupScores,
    groups
  }
}

module.exports = createSummary
