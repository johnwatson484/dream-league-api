import db from '../data/index.ts'

export async function getGoalReports (status?: string): Promise<any[]> {
  const where: any = {}
  if (status) {
    where.status = status
  }

  return db.GoalReport.findAll({
    where,
    include: [
      { model: db.Player, as: 'player', include: [{ model: db.Team, as: 'team' }] },
      { model: db.Manager, as: 'manager' },
      { model: db.Gameweek, as: 'gameweek' },
    ],
    order: [['created', 'DESC']],
  })
}
