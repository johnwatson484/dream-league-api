import db from '../data/index.ts'
import { mapKeeper } from './map-keeper.ts'
import { mapPlayer } from './map-player.ts'
import { orderKeepers } from '../utils/order-keepers.ts'
import { orderPlayers } from '../utils/order-players.ts'

export async function getTeam (managerId: number) {
  const manager: any = await db.Manager.findOne({
    where: { managerId },
    include: [
      {
        model: db.Player,
        as: 'players',
        attributes: ['playerId', 'firstName', 'lastName', 'position'],
        through: { attributes: ['substitute'] },
        include: [{
          model: db.Team, as: 'team', attributes: ['teamId', 'name'],
        }, {
          model: db.Goal, as: 'goals', attributes: ['goalId', 'playerId', 'cup'],
        }],
      },
      {
        model: db.Team,
        as: 'keepers',
        attributes: ['teamId', 'name'],
        through: { attributes: ['substitute'] },
        include: [{ model: db.Concede, as: 'conceded', attributes: ['concedeId', 'teamId', 'cup'] }],
      },
    ],
    nest: true,
  } as any)

  return {
    managerId: manager.managerId,
    name: manager.name,
    keepers: orderKeepers(manager.keepers.map((x: any) => mapKeeper(x.dataValues))),
    players: orderPlayers(manager.players.map(mapPlayer)),
  }
}
