import db from '../../data/index.js'

export async function getManager (manager) {
  return db.Manager.findOne({ attributes: ['managerId'], where: { alias: { [db.Sequelize.Op.iLike]: manager } }, raw: true })
}

export async function getLeaguePlayers () {
  return db.Player.findAll({ include: [{ model: db.Team, as: 'team', attributes: ['alias'] }], raw: true, nest: true })
}

export async function getLeagueTeams () {
  return db.Team.findAll({ raw: true })
}
