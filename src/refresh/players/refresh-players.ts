import { mapPlayer } from './map-player.ts'
import { run } from './run.ts'

export async function refreshPlayers (players) {
  const mappedPlayers = []
  const unmappedPlayers = []
  for (const player of players) {
    const mappedPlayer = await mapPlayer(player)
    if (mappedPlayer) {
      mappedPlayers.push(mappedPlayer)
    } else {
      unmappedPlayers.push(player)
    }
  }

  if (!unmappedPlayers.length && mappedPlayers.length) {
    await run(mappedPlayers)
  }

  return {
    success: !unmappedPlayers.length,
    unmappedPlayers,
  }
}
