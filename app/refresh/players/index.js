const { mapPlayer } = require('./map-player')
const { run } = require('./run')

const refresh = async (players) => {
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

module.exports = {
  refresh,
}
