const db = require('../../data/models')

async function update (results) {
  const resultsDate = new Date()
  await updateConceded(results, resultsDate)
  await updateGoals(results.resultsDate)
}

async function updateConceded (results, resultsDate) {
  const conceded = results.conceded.filter(x => x.conceded > 0)
  for (const concede of conceded) {
    const managerId = await db.ManagerGoalKeepers.findOne({ where: { teamId: concede.teamId } })
    for (let i = 0; i < concede.conceded.length; i++) {
      await db.Concede.create({
        teamId: conceded.teamId,
        GameWeekId: results.gameWeekId,
        managerId,
        created: resultsDate,
        createdBy: 'results-sheet'
      })
    }
  }
}

async function updateGoals (results, resultsDate) {
  const goals = results.goals.filter(x => x.goals > 0)
  for (const goal of goals) {
    const managerId = await db.ManagerPlayers.findOne({ where: { playerId: goal.playerId } })
    for (let i = 0; i < goal.goals.length; i++) {
      await db.Goal.create({
        playerId: goals.playerId,
        GameWeekId: results.gameWeekId,
        managerId,
        created: resultsDate,
        createdBy: 'results-sheet'
      })
    }
  }
}

module.exports = update
