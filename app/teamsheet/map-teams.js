import { mapPlayer } from './map-player.js'
import { mapKeeper } from './map-keeper.js'
import { orderKeepers } from '../utils/order-keepers.js'
import { orderPlayers } from '../utils/order-players.js'

const mapTeams = (team) => {
  return {
    managerId: team.managerId,
    name: team.name,
    keepers: orderKeepers(team.keepers.map(x => mapKeeper(x.dataValues, team.teamsheet))),
    players: orderPlayers(team.players.map(x => mapPlayer(x, team.teamsheet))),
  }
}

export { mapTeams }
