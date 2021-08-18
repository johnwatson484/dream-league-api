const db = require('../data')

const getPlayers = async () => {
  return db.ManagerPlayer.findAll({
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
}

module.exports = getPlayers
