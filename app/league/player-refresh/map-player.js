const positions = require('../../config').positions
const db = require('../../data/models')

async function mapPlayer (player) {
  const teamId = await db.Team.findOne({ attributes: ['teamId'], where: { alias: player.team } })
  const position = mapPosition(player.position)
  if (teamId && position) {
    const firstName = mapFirstName(player)
    const lastName = mapLastName(player)
    return {
      firstName,
      lastName,
      position,
      teamId
    }
  }
  return undefined
}

function mapPosition (position) {
  switch (position) {
    case 'GK':
      return 'Goalkeeper'
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

module.exports = mapPlayer
