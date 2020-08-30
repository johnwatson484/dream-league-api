const positions = ['GK', 'DEF', 'MID', 'FWD']
const db = require('../../data/models')
const mapPosition = require('../../position')

async function mapPlayer (player) {
  const team = await db.Team.findOne({ attributes: ['teamId'], where: { alias: { [db.Sequelize.Op.iLike]: player.team } }, raw: true })
  const position = mapPosition(player.position)
  if (team && position) {
    const firstName = mapFirstName(player)
    const lastName = mapLastName(player)
    return {
      firstName,
      lastName,
      position,
      teamId: team.teamId
    }
  }
  return undefined
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
