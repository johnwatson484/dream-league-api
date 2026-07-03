import { mapPlayer } from './map-player.js'
import { mapTeam } from './map-team.js'
import { mapPosition } from '../map-position.js'
import { addTeamsheetMatch, addPlayer, addKeeper } from './add-team.js'
import { getLeagueTeams, getLeaguePlayers } from './get-league-data.js'

const matchTeam = async (managerId, players) => {
  for (const player of players) {
    const position = mapPosition(player.position)
    await matchPlayers(player, position, managerId)
  }
}

const matchPlayers = async (player, position, managerId) => {
  const leagueTeams = await getLeagueTeams()
  const leaguePlayers = await getLeaguePlayers()

  const { bestMatchId, distance } = isKeeper(position) ? mapTeam(leagueTeams, player.player) : mapPlayer(leaguePlayers, player.player, position)
  if (bestMatchId !== -1) {
    try {
      isKeeper(position) ? await addKeeper(managerId, bestMatchId, player.substitute) : await addPlayer(managerId, bestMatchId, player.substitute)
      await addTeamsheetMatch(managerId, player, position, bestMatchId, distance)
    } catch (err) {
      console.error(err)
    }
  }
}

const isKeeper = (position) => {
  return position === 'Goalkeeper'
}

export { matchTeam }
