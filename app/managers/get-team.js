const db = require('../data')
const mapKeeper = require('./map-keeper')
const mapPlayer = require('./map-player')
const orderKeepers = require('../utils/order-keepers')
const orderPlayers = require('../utils/order-players')

const getTeam = async (managerId) => {
  const manager = await db.Manager.findOne({
    where: { managerId },
    include: [
      {
        model: db.Player,
        as: 'players',
        attributes: ['playerId', 'firstName', 'lastName', 'position'],
        through: { attributes: ['substitute'] },
        include: [{
          model: db.Team, as: 'team', attributes: ['teamId', 'name']
        }, {
          model: db.Goal, as: 'goals', attributes: ['goalId', 'playerId', 'cup']
        }]
      },
      {
        model: db.Team,
        as: 'keepers',
        attributes: ['teamId', 'name'],
        through: { attributes: ['substitute'] },
        include: { model: db.Concede, as: 'conceded', attributes: ['concedeId', 'teamId', 'cup'] }
      }
    ],
    nest: true
  })

  return {
    managerId: manager.managerId,
    name: manager.name,
    keepers: orderKeepers(manager.keepers.map(x => mapKeeper(x.dataValues))),
    players: orderPlayers(manager.players.map(mapPlayer))
  }
}

module.exports = getTeam
