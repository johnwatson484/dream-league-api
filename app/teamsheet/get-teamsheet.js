const db = require('../data')
const mapTeams = require('./map-teams')

const getTeamsheet = async () => {
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

module.exports = getTeamsheet
