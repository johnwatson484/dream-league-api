import db from '../data/index.ts'
import { createSummary } from '../results/create-summary.ts'

export async function acceptGoalReport (goalReportId: number, reviewedBy: number): Promise<void> {
  const goalReport: any = await db.GoalReport.findByPk(goalReportId)
  if (!goalReport) {
    throw new Error('Goal report not found')
  }
  if (goalReport.status !== 'pending') {
    throw new Error('Goal report has already been reviewed')
  }

  const transaction = await db.sequelize.transaction()
  try {
    await goalReport.update({
      status: 'approved',
      reviewedBy,
      reviewedAt: new Date(),
    }, { transaction })

    const now = new Date()

    for (let i = 0; i < goalReport.goals; i++) {
      await db.Goal.create({
        playerId: goalReport.playerId,
        gameweekId: goalReport.gameweekId,
        managerId: goalReport.managerId,
        cup: false,
        created: now,
        createdBy: 'goal-report',
      }, { transaction })
    }

    for (let i = 0; i < goalReport.goalsCup; i++) {
      await db.Goal.create({
        playerId: goalReport.playerId,
        gameweekId: goalReport.gameweekId,
        managerId: goalReport.managerId,
        cup: true,
        created: now,
        createdBy: 'goal-report',
      }, { transaction })
    }

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }

  await createSummary(goalReport.gameweekId)
}
