const refresh = require('./refresh')
const db = require('../../data/models')
const { updatePlayer, updateKeeper } = require('./update')
const sortArray = require('../../utils/sort-array')

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
    keepers: orderKeepers(team.keepers.map(x => mapKeeper(x.dataValues, team.teamsheet))),
    players: orderPlayers(team.players.map(x => mapPlayer(x, team.teamsheet)))
  }
}

function mapKeeper (keeper, teamsheet) {
  const teamsheetEntry = teamsheet.find(x => x.bestMatchId === keeper.teamId && x.position === 'Goalkeeper')
  return {
    teamId: keeper.teamId,
    name: keeper.name,
    sourceName: teamsheetEntry ? teamsheetEntry.player : '',
    matchDistance: teamsheetEntry ? teamsheetEntry.distance : '',
    substitute: keeper.managerKeepers.dataValues.substitute
  }
}

function mapPlayer (player, teamsheet) {
  const teamsheetEntry = teamsheet.find(x => x.dataValues.bestMatchId === player.dataValues.playerId && x.dataValues.position === player.dataValues.position)
  return {
    playerId: player.dataValues.playerId,
    fullName: player.fullName,
    lastNameFirstName: player.lastNameFirstName,
    position: player.dataValues.position,
    team: player.dataValues.team.dataValues.name,
    sourceName: teamsheetEntry ? teamsheetEntry.player : '',
    matchDistance: teamsheetEntry ? teamsheetEntry.distance : '',
    substitute: player.managerPlayers.dataValues.substitute
  }
}

function orderKeepers (keepers) {
  return keepers.sort((a, b) => { return sortArray(a.substitute, b.substitute) || sortArray(a.name, b.name) })
}

function orderPlayers (players) {
  return players.sort((a, b) => { return sortArray(rankPosition(a.position), rankPosition(b.position)) || sortArray(a.substitute, b.substitute) || sortArray(a.lastNameFirstName, b.lastNameFirstName) })
}

function rankPosition (position) {
  switch (position) {
    case 'Defender':
      return 0
    case 'Midfielder':
      return 1
    default:
      return 2
  }
}

module.exports = {
  get,
  refresh,
  updatePlayer,
  updateKeeper
}
