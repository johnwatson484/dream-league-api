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
    defenders: getPlayers(team.players, team.teamsheet, 'Defender'),
    midfielders: getPlayers(team.players, team.teamsheet, 'Midfielder'),
    forwards: getPlayers(team.players, team.teamsheet, 'Forward')
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

function getPlayers (players, teamsheet, position) {
  const validPlayers = players.filter(x => x.dataValues.position === position)
  return validPlayers.map(x => mapPlayer(x, teamsheet))
}

function mapPlayer (player, teamsheet) {
  const teamsheetEntry = teamsheet.find(x => x.dataValues.bestMatchId === player.dataValues.playerId && x.dataValues.position === player.dataValues.position)
  return {
    playerId: player.dataValues.teamId,
    fullName: player.fullName,
    lastNameFirstName: player.lastNameFirstName,
    position: player.dataValues.position,
    team: player.dataValues.team.dataValues.name,
    sourceName: teamsheetEntry.player,
    matchDistance: teamsheetEntry.distance,
    substitute: player.dataValues.substitute
  }
}

module.exports = {
  get,
  refresh
}
