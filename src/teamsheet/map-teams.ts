import { mapPlayer } from './map-player.ts'
import { mapKeeper } from './map-keeper.ts'
import { orderKeepers } from '../utils/order-keepers.ts'
import { orderPlayers } from '../utils/order-players.ts'

export function mapTeams (team: any): any {
  return {
    managerId: team.managerId,
    name: team.name,
    keepers: orderKeepers(team.keepers.map((x: any) => mapKeeper(x.dataValues, team.teamsheet))),
    players: orderPlayers(team.players.map((x: any) => mapPlayer(x, team.teamsheet))),
  }
}
