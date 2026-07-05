import { Op } from 'sequelize'
import db from '../../data/index.ts'
import { mapPosition } from '../map-position.ts'
const positions = ['GK', 'DEF', 'MID', 'FWD']

export async function mapPlayer (player: any) {
  const team: any = await db.Team.findOne({ attributes: ['teamId'], where: { alias: { [Op.iLike]: player.team } }, raw: true })
  const position = mapPosition(player.position)
  if (team && position) {
    const firstName = mapFirstName(player)
    const lastName = mapLastName(player)
    return {
      firstName,
      lastName,
      position,
      teamId: team.teamId,
    }
  }
  return undefined
}

function mapFirstName (player: any): string | undefined {
  if (!player.firstName || positions.includes(player.lastName) || !player.lastName) {
    return undefined
  }
  return player.firstName
}

function mapLastName (player: any): string {
  if (player.firstName && (!player.lastName || positions.includes(player.lastName))) {
    return player.firstName
  }
  return player.lastName
}
