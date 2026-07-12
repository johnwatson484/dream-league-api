import { Op } from 'sequelize'
import db from '../data/index.ts'
import { compare } from '../utils/compare.ts'

export async function getTopScorers (): Promise<any[]> {
  const playersToInclude = await db.Manager.count()
  let goals = await db.Goal.findAll({
    raw: true,
    group: ['playerId'],
    attributes: ['playerId', [db.sequelize.fn('COUNT', db.sequelize.col('goalId')), 'goals']],
    order: [[db.sequelize.col('goals'), 'DESC']],
    where: { cup: false },
  })

  goals = goals.slice(0, playersToInclude)

  const playerIds = (goals as any[]).map((g) => g.playerId)

  const players = await db.Player.findAll({
    raw: true,
    where: { playerId: { [Op.in]: playerIds } },
    include: [
      { model: db.Manager, as: 'managers', attributes: [], through: { attributes: [] } },
      { model: db.Team, as: 'team', attributes: [] },
    ],
    attributes: ['playerId', 'firstName', 'lastName', [db.Sequelize.col('team.name'), 'team'], [db.Sequelize.col('managers.name'), 'manager'], [db.Sequelize.col('managers.managerId'), 'managerId']],
  } as any)

  const playerMap = new Map((players as any[]).map((p) => [p.playerId, p]))

  const scorers = (goals as any[]).map((goal) => ({
    ...playerMap.get(goal.playerId),
    goals: Number(goal.goals),
  }))

  return orderScorers(scorers)
}

function orderScorers (scorers: any[]): any[] {
  return scorers.toSorted((a, b) => { return compare(b.goals, a.goals) || compare(a.lastName, b.lastName) || compare(a.firstName, b.firstName) })
    .map((x, i) => ({ position: i + 1, ...x }))
}
