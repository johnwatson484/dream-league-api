const refresh = require('./refresh')
const db = require('../../data/models')

async function get () {
  const managers = await db.Manager.findAll({
    include: [
      {
        model: db.Player,
        as: 'players',
        attributes: ['playerId', 'firstName', 'lastName', 'position'],
        through: { attributes: ['substitute'] },
        include: { model: db.Team, as: 'team', attributes: ['teamId', 'name'] }
      },
      { model: db.Team, as: 'keepers', attributes: ['teamId', 'name'], through: { attributes: ['substitute'] } },
      { model: db.Teamsheet, as: 'teamsheet' }
    ],
    nest: true
  })

  return managers.map(x => mapTeams(x.dataValues))
}

function mapTeams (team) {
  return {
    managerId: team.managerId,
    name: team.name,
    keepers: team.keepers.map(x => mapKeeper(x.dataValues, team.teamsheet)),
    players: team.players.map(x => mapPlayer(x.dataValues, team.teamsheet))
  }
}

function mapKeeper (keeper, teamsheet) {
  const teamsheetEntry = teamsheet.find(x => x.bestMatchId === keeper.teamId && x.position === 'Goalkeeper')
  return {
    teamId: keeper.teamId,
    name: keeper.name,
    sourceName: teamsheetEntry.player,
    matchDistance: teamsheetEntry.distance,
    substitute: keeper.substitute
  }
}

function mapPlayer (player, teamsheet) {
  const teamsheetEntry = teamsheet.find(x => x.dataValues.bestMatchId === player.playerId && x.dataValues.position === player.position)
  return {
    playerId: player.teamId,
    firstName: player.firstName,
    lastName: player.lastName,
    position: player.position,
    team: player.team.dataValues.name,
    sourceName: teamsheetEntry.player,
    matchDistance: teamsheetEntry.distance,
    substitute: player.substitute
  }
}

module.exports = {
  get,
  refresh
}
