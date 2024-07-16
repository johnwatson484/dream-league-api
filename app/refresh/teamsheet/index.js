const { getManager } = require('./get-league-data')
const { deleteCurrentTeam } = require('./delete-team')
const { matchTeam } = require('./match-team')

const refresh = async (teams) => {
  for (const team of teams) {
    const manager = await getManager(team.manager)
    if (manager) {
      await updateTeam(manager.managerId, team.players)
    }
  }
  return {
    success: true,
  }
}

const updateTeam = async (managerId, players) => {
  await deleteCurrentTeam(managerId)
  await matchTeam(managerId, players)
}

module.exports = {
  refresh,
}
