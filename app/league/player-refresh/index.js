const mapPlayer = require('./map-player')
const run = require('./run')

async function refresh (players) {
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
  if (unmappedPlayers.length) {
    return {
      success: false,
      unmappedPlayers
    }
  } else {
    await run(mappedPlayers)
    return { success: true }
  }
}

module.exports = refresh
