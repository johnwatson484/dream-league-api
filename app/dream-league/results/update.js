const db = require('../../data')
const createSummary = require('./create-summary')

async function update (results) {
  const resultsDate = new Date()
  await updateConceded(results, resultsDate)
  await updateGoals(results, resultsDate)
  await updateConcededCup(results, resultsDate)
  await updateGoalsCup(results, resultsDate)
  await createSummary(results.gameweekId)
}

async function updateConceded (results, resultsDate) {
  const conceded = results.conceded?.filter(x => x.conceded > 0) || []
  for (const concede of conceded) {
    const manager = await db.ManagerKeeper.findOne({ where: { teamId: concede.teamId } })
    if (manager) {
      for (let i = 0; i < concede.conceded; i++) {
        await db.Concede.create({
          teamId: concede.teamId,
          gameweekId: results.gameweekId,
          managerId: manager.managerId,
          cup: false,
          created: resultsDate,
          createdBy: 'results-sheet'
        })
      }
    }
  }
}

async function updateGoals (results, resultsDate) {
  const goals = results.goals?.filter(x => x.goals > 0) || []
  for (const goal of goals) {
    const manager = await db.ManagerPlayer.findOne({ where: { playerId: goal.playerId } })
    if (manager) {
      for (let i = 0; i < goal.goals; i++) {
        await db.Goal.create({
          playerId: goal.playerId,
          gameweekId: results.gameweekId,
          managerId: manager.managerId,
          cup: false,
          created: resultsDate,
          createdBy: 'results-sheet'
        })
      }
    }
  }
}

async function updateConcededCup (results, resultsDate) {
  const conceded = results.concededCup?.filter(x => x.conceded > 0) || []
  for (const concede of conceded) {
    const manager = await db.ManagerKeeper.findOne({ where: { teamId: concede.teamId } })
    if (manager) {
      for (let i = 0; i < concede.conceded; i++) {
        await db.Concede.create({
          teamId: concede.teamId,
          gameweekId: results.gameweekId,
          managerId: manager.managerId,
          cup: true,
          created: resultsDate,
          createdBy: 'results-sheet'
        })
      }
    }
  }
}

async function updateGoalsCup (results, resultsDate) {
  const goals = results.goalsCup?.filter(x => x.goals > 0) || []
  for (const goal of goals) {
    const manager = await db.ManagerPlayer.findOne({ where: { playerId: goal.playerId } })
    if (manager) {
      for (let i = 0; i < goal.goals; i++) {
        await db.Goal.create({
          playerId: goal.playerId,
          gameweekId: results.gameweekId,
          managerId: manager.managerId,
          cup: true,
          created: resultsDate,
          createdBy: 'results-sheet'
        })
      }
    }
  }
}

module.exports = update
