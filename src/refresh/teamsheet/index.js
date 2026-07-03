import { getManager } from './get-league-data.js'
import { deleteCurrentTeam } from './delete-team.js'
import { matchTeam } from './match-team.js'

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

export { refresh }
