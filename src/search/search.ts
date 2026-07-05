import { Op } from 'sequelize'
import db from '../data/index.ts'

export async function search (prefix: string): Promise<any[]> {
  const result: any[] = []

  // Search players
  const players = await db.Player.findAll({
    where: {
      [Op.or]: [{
        lastName: { [Op.iLike]: `${prefix}%` },
      }, {
        firstName: { [Op.iLike]: `${prefix}%` },
      }],
    },
    include: [{
      model: db.Team,
      as: 'team',
      attributes: ['name'],
    }],
    limit: 10,
  })

  players.forEach((player: any) => {
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
      name: { [Op.iLike]: `${prefix}%` },
    },
    include: [{
      model: db.Division,
      as: 'division',
      attributes: ['name'],
    }],
    limit: 10,
  })

  teams.forEach((team: any) => {
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
      name: { [Op.iLike]: `%${prefix}%` },
    },
    limit: 10,
  })

  managers.forEach((manager: any) => {
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
      name: { [Op.iLike]: `${prefix}%` },
    },
    limit: 5,
  })

  divisions.forEach((division: any) => {
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
