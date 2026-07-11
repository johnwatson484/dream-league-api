import { mapPlayer } from './map-player.ts'
import { mapTeam } from './map-team.ts'
import { mapPosition } from '../map-position.ts'
import { addTeamsheetMatch, addPlayer, addKeeper } from './add-team.ts'
import { getLeagueTeams, getLeaguePlayers } from './get-league-data.ts'
import logger from '../../logger.ts'

export async function matchTeam (managerId: number, players: any[]): Promise<void> {
  for (const player of players) {
    const position = mapPosition(player.position)
    await matchPlayers(player, position, managerId)
  }
}

async function matchPlayers (player: any, position: string | undefined, managerId: number): Promise<void> {
  const leagueTeams = await getLeagueTeams()
  const leaguePlayers = await getLeaguePlayers()

  const { bestMatchId, distance } = isKeeper(position) ? mapTeam(leagueTeams, player.player) : mapPlayer(leaguePlayers, player.player, position)
  if (bestMatchId !== -1) {
    try {
      isKeeper(position) ? await addKeeper(managerId, bestMatchId, player.substitute) : await addPlayer(managerId, bestMatchId, player.substitute)
      await addTeamsheetMatch(managerId, player, position, bestMatchId, distance)
    } catch (err) {
      logger.error(err)
    }
  }
}

function isKeeper (position: string | undefined): boolean {
  return position === 'Goalkeeper'
}
