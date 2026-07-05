import db from '../data/index.ts'
import { mapTeams } from './map-teams.ts'

export async function getTeamsheet (): Promise<any[]> {
  const managers = await db.Manager.findAll({
    include: [
      {
        model: db.Player,
        as: 'players',
        attributes: ['playerId', 'firstName', 'lastName', 'position'],
        through: { attributes: ['substitute'] },
        include: [{ model: db.Team, as: 'team', attributes: ['teamId', 'name'] }],
      },
      { model: db.Team, as: 'keepers', attributes: ['teamId', 'name'], through: { attributes: ['substitute'] } },
      { model: db.Teamsheet, as: 'teamsheet' },
    ],
    nest: true,
    order: [['name', 'ASC']],
  } as any)

  return managers.map((x: any) => mapTeams(x.dataValues))
}
