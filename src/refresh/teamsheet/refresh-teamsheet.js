import { getManager } from './get-league-data.js'
import { deleteCurrentTeam } from './delete-team.js'
import { matchTeam } from './match-team.js'

export async function refreshTeamsheet (teams) {
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

async function updateTeam (managerId, players) {
  await deleteCurrentTeam(managerId)
  await matchTeam(managerId, players)
}
