import { mapPlayer } from './map-player.ts'

interface UnmappedTeam {
  team: string
  players: Array<{ firstName: string; lastName: string; position: string }>
}

export async function previewPlayers (players: any[]) {
  const mappedPlayers = []
  const unmappedByTeam = new Map<string, UnmappedTeam>()

  for (const player of players) {
    const mappedPlayer = await mapPlayer(player)
    if (mappedPlayer) {
      mappedPlayers.push(mappedPlayer)
    } else {
      const teamName = player.team || 'Unknown'
      if (!unmappedByTeam.has(teamName)) {
        unmappedByTeam.set(teamName, { team: teamName, players: [] })
      }
      unmappedByTeam.get(teamName)!.players.push({
        firstName: player.firstName,
        lastName: player.lastName,
        position: player.position,
      })
    }
  }

  return {
    mappedPlayers,
    unmappedTeams: [...unmappedByTeam.values()],
  }
}
