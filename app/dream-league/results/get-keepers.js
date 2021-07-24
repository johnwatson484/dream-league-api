const db = require('../../data')

async function getKeepers () {
  return await db.ManagerKeeper.findAll({
    where: { substitute: false },
    include: [{ model: db.Team, attributes: [], include: { model: db.Division, as: 'division', attributes: [] } }, {
      model: db.Manager, attributes: [], include: [{ model: db.Team, as: 'keepers', attributes: [], through: { attributes: [], where: { substitute: true } } }]
    }],
    attributes: ['managerId', 'teamId', [db.Sequelize.col('Manager.keepers.name'), 'substitute'], [db.Sequelize.col('Team.name'), 'team'], [db.Sequelize.col('Team.division.name'), 'division'], [db.Sequelize.col('Manager.name'), 'manager']],
    raw: true
  })
}

module.exports = getKeepers
