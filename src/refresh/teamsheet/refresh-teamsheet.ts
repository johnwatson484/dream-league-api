import { getManager } from './get-league-data.ts'
import { deleteCurrentTeam } from './delete-team.ts'
import { matchTeam } from './match-team.ts'

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
