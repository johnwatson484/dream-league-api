import { mapPlayer } from './map-player.ts'
import { mapKeeper } from './map-keeper.ts'
import { orderKeepers } from '../utils/order-keepers.ts'
import { orderPlayers } from '../utils/order-players.ts'

export function mapTeams (team) {
  return {
    managerId: team.managerId,
    name: team.name,
    keepers: orderKeepers(team.keepers.map(x => mapKeeper(x.dataValues, team.teamsheet))),
    players: orderPlayers(team.players.map(x => mapPlayer(x, team.teamsheet))),
  }
}
