const mapPlayer = require('./map-player')
const mapTeam = require('./map-team')
const mapPosition = require('../../position')
const { addTeamsheetMatch, addPlayer, addKeeper } = require('./add-team')
const { getLeagueTeams, getLeaguePlayers } = require('./get-league-data')

async function matchTeam (managerId, players) {
  for (const player of players) {
    const position = mapPosition(player.position)
    await matchPlayers(player, position, managerId)
  }
}

async function matchPlayers (player, position, managerId) {
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

function isKeeper (position) {
  return position === 'Goalkeeper'
}

module.exports = matchTeam
