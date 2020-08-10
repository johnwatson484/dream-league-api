const db = require('../../data/models')
const positions = require('../../config').positions
const mappedPlayers = []
const unmappedPlayers = []

async function refresh (players) {
  players.forEach(async player => {
    await mapPlayer(player)
  })
  if (unmappedPlayers.length) {
    return {
      success: false,
      unmappedPlayers
    }
  } else {
    // TODO: add save to database
  }
}

async function mapPlayer (player) {
  const teamId = await db.Team.findOne({ where: { alias: player.team } })
  const position = mapPosition(player.position)
  if (teamId && position) {
    const firstName = mapFirstName(player)
    const lastName = mapLastName(player)
    mappedPlayers.push({
      firstName,
      lastName,
      position,
      teamId
    })
  } else {
    if (position) {
      unmappedPlayers.push({
        player
      })
    }
  }
}

function mapPosition (position) {
  switch (position) {
    case 'DEF':
      return 'Defender'
    case 'MID':
      return 'Midfielder'
    case 'FWD':
      return 'Forward'
    default:
      return undefined
  }
}

function mapFirstName (player) {
  if (!player.firstName || positions.includes(player.lastName) || !player.lastName) {
    return undefined
  }
  return player.firstName
}

function mapLastName (player) {
  if (player.firstName && (!player.lastName || positions.includes(player.lastName))) {
    return player.firstName
  }
  return player.lastName
}

module.exports = refresh
