const db = require('../data')

const search = async (prefix) => {
  const result = []

  // Search players
  const players = await db.Player.findAll({
    where: {
      [db.Sequelize.Op.or]: [{
        lastName: { [db.Sequelize.Op.iLike]: `${prefix}%` },
      }, {
        firstName: { [db.Sequelize.Op.iLike]: `${prefix}%` },
      }],
    },
    include: [{
      model: db.Team,
      as: 'team',
      attributes: ['name'],
    }],
    limit: 10,
  })

  players.forEach((player) => {
    result.push({
      type: 'player',
      label: `${player.firstName} ${player.lastName} - ${player.team.name}`,
      data: {
        playerId: player.playerId,
        firstName: player.firstName,
        lastName: player.lastName,
        teamName: player.team.name,
      },
    })
  })

  // Search teams
  const teams = await db.Team.findAll({
    where: {
      name: { [db.Sequelize.Op.iLike]: `${prefix}%` },
    },
    include: [{
      model: db.Division,
      as: 'division',
      attributes: ['name'],
    }],
    limit: 10,
  })

  teams.forEach((team) => {
    result.push({
      type: 'team',
      label: team.name,
      data: {
        teamId: team.teamId,
        name: team.name,
        divisionName: team.division?.name,
      },
    })
  })

  // Search managers
  const managers = await db.Manager.findAll({
    where: {
      name: { [db.Sequelize.Op.iLike]: `%${prefix}%` },
    },
    limit: 10,
  })

  managers.forEach((manager) => {
    result.push({
      type: 'manager',
      label: manager.name,
      data: {
        managerId: manager.managerId,
        name: manager.name,
      },
    })
  })

  // Search divisions
  const divisions = await db.Division.findAll({
    where: {
      name: { [db.Sequelize.Op.iLike]: `${prefix}%` },
    },
    limit: 5,
  })

  divisions.forEach((division) => {
    result.push({
      type: 'division',
      label: division.name,
      data: {
        divisionId: division.divisionId,
        name: division.name,
      },
    })
  })

  // Base searches (common pages)
  const baseSearches = [
    { type: 'page', label: 'Players', data: { page: 'players' } },
    { type: 'page', label: 'Teams', data: { page: 'teams' } },
    { type: 'page', label: 'Managers', data: { page: 'managers' } },
    { type: 'page', label: 'Meetings', data: { page: 'meetings' } },
    { type: 'page', label: 'Results', data: { page: 'results' } },
    { type: 'page', label: 'Teamsheet', data: { page: 'teamsheet' } },
    { type: 'page', label: 'History', data: { page: 'history' } },
    { type: 'page', label: 'Rules', data: { page: 'rules' } },
    { type: 'page', label: 'Cups', data: { page: 'cups' } },
    { type: 'page', label: 'Groups', data: { page: 'groups' } },
    { type: 'page', label: 'Fixtures', data: { page: 'fixtures' } },
  ]

  const matchingBaseSearches = baseSearches.filter((item) =>
    item.label.toUpperCase().startsWith(prefix.toUpperCase())
  )

  result.push(...matchingBaseSearches)

  return result
}

module.exports = {
  search,
}
