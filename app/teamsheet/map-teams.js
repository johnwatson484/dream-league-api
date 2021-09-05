const mapPlayer = require('./map-player')
const mapKeeper = require('./map-keeper')
const orderKeepers = require('../utils/order-keepers')
const orderPlayers = require('../utils/order-players')

const mapTeams = (team) => {
  return {
    managerId: team.managerId,
    name: team.name,
    keepers: orderKeepers(team.keepers.map(x => mapKeeper(x.dataValues, team.teamsheet))),
    players: orderPlayers(team.players.map(x => mapPlayer(x, team.teamsheet)))
  }
}

module.exports = mapTeams
