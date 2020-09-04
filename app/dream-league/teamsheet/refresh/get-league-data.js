const db = require('../../../data/models')

async function getManager (manager) {
  return await db.Manager.findOne({ attributes: ['managerId'], where: { alias: { [db.Sequelize.Op.iLike]: manager } }, raw: true })
}

async function getLeaguePlayers () {
  return await db.Player.findAll({ include: [{ model: db.Team, as: 'team', attributes: ['alias'] }], raw: true, nest: true })
}

async function getLeagueTeams () {
  return await db.Team.findAll({ raw: true })
}

module.exports = {
  getManager,
  getLeaguePlayers,
  getLeagueTeams
}
