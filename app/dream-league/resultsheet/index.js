const db = require('../../data/models')

async function get () {
  const gameweeks = await db.Gameweek.findAll()
  const keepers = await db.ManagerKeeper.findAll({
    where: { substitute: false },
    include: [{ model: db.Team, attributes: [], include: { model: db.Division, as: 'division', attributes: [] } }, {
      model: db.Manager, attributes: [], include: [{ model: db.Team, as: 'keepers', attributes: [], through: { attributes: [], where: { substitute: true } } }]
    }],
    attributes: ['managerId', 'teamId', [db.Sequelize.col('Manager.keepers.name'), 'substitute'], [db.Sequelize.col('Team.name'), 'team'], [db.Sequelize.col('Team.division.name'), 'division'], [db.Sequelize.col('Manager.name'), 'manager']],
    raw: true
  })
  const players = await db.ManagerPlayer.findAll({
    where: { substitute: false },
    include: [{
      model: db.Player,
      include: [{ model: db.Team, as: 'team', attributes: [], include: { model: db.Division, as: 'division', attributes: [] } }],
      attributes: []
    }, {
      model: db.Manager, attributes: []
    }],
    attributes: ['managerId', 'playerId', [db.Sequelize.col('Player.firstName'), 'firstName'], [db.Sequelize.col('Player.lastName'), 'lastName'], [db.Sequelize.col('Player.team.name'), 'team'], [db.Sequelize.col('Player.team.division.name'), 'division'], [db.Sequelize.col('Manager.name'), 'manager']]
  })
  return { gameweeks, keepers, players }
}

module.exports = {
  get
}
