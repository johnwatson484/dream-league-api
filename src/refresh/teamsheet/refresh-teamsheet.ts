import { getManager } from './get-league-data.ts'
import { deleteCurrentTeam } from './delete-team.ts'
import { matchTeam } from './match-team.ts'

export async function refreshTeamsheet (teams: any[]) {
  for (const team of teams) {
    const manager = await getManager(team.manager)
    if (manager) {
      await updateTeam((manager as any).managerId, team.players)
    }
  }
  return {
    success: true,
  }
}

async function updateTeam (managerId: number, players: any[]): Promise<void> {
  await deleteCurrentTeam(managerId)
  await matchTeam(managerId, players)
}
