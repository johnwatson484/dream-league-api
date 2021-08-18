const db = require('../../data')

const getManager = async (manager) => {
  return db.Manager.findOne({ attributes: ['managerId'], where: { alias: { [db.Sequelize.Op.iLike]: manager } }, raw: true })
}

const getLeaguePlayers = async () => {
  return db.Player.findAll({ include: [{ model: db.Team, as: 'team', attributes: ['alias'] }], raw: true, nest: true })
}

const getLeagueTeams = async () => {
  return db.Team.findAll({ raw: true })
}

module.exports = {
  getManager,
  getLeaguePlayers,
  getLeagueTeams
}
