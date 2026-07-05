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

  const scorers = []
  for (const goal of goals as any[]) {
    const player = await db.Player.findOne({
      raw: true,
      where: { playerId: goal.playerId },
      include: [
        { model: db.Manager, as: 'managers', attributes: [], through: { attributes: [] } },
        { model: db.Team, as: 'team', attributes: [] },
      ],
      attributes: ['playerId', 'firstName', 'lastName', [db.Sequelize.col('team.name'), 'team'], [db.Sequelize.col('managers.name'), 'manager'], [db.Sequelize.col('managers.managerId'), 'managerId']],
    } as any)
    scorers.push({
      ...player,
      goals: Number(goal.goals),
    })
  }

  return orderScorers(scorers)
}

function orderScorers (scorers: any[]): any[] {
  return scorers.toSorted((a, b) => { return compare(b.goals, a.goals) || compare(a.lastName, b.lastName) || compare(a.firstName, b.firstName) })
    .map((x, i) => ({ position: i + 1, ...x }))
}
