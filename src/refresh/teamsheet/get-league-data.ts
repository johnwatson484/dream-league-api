import { Op } from 'sequelize'
import db from '../../data/index.ts'

export async function getManager (manager: string) {
  return db.Manager.findOne({ attributes: ['managerId'], where: { alias: { [Op.iLike]: manager } }, raw: true })
}

export async function getLeaguePlayers () {
  return db.Player.findAll({ include: [{ model: db.Team, as: 'team', attributes: ['alias'] }], raw: true, nest: true })
}

export async function getLeagueTeams () {
  return db.Team.findAll({ raw: true })
}
