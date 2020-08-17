const mapPlayer = require('./map-player')
const runRefresh = require('./run-refresh')

async function refresh (players) {
  const mappedPlayers = []
  const unmappedPlayers = []
  for (const player of players) {
    const mappedPlayer = await mapPlayer(player)
    if (mappedPlayer) {
      mappedPlayers.push(mappedPlayers)
    } else {
      unmappedPlayers.push(player)
    }
  }
  if (unmappedPlayers.length) {
    return {
      success: false,
      unmappedPlayers
    }
  } else {
    await runRefresh(mappedPlayers)
    return { success: true }
  }
}

module.exports = refresh
