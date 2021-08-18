const calculateDistance = require('../../levenshtein')

const mapPlayer = (players, matchPlayer, position) => {
  const matchText = matchPlayer.replace(/' '/g, '').toUpperCase()
  let bestDistance = -1
  let bestPlayerId = -1

  if (position) {
    players = players.filter(x => x.position === position)
  }

  for (const player of players) {
    const lastNames = player.lastName.split(' ')
    for (const lastName of lastNames) {
      const playerMatchText = `${lastName}-${player.team.alias}`.replace(/' '/g, '').toUpperCase()
      const distance = calculateDistance(matchText, playerMatchText)
      if ((bestDistance === -1 || distance < bestDistance)) {
        bestDistance = distance
        bestPlayerId = player.playerId
      }
    }
  }

  return {
    bestMatchId: bestPlayerId,
    distance: bestDistance
  }
}

module.exports = mapPlayer
