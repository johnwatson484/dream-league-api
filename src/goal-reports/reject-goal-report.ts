import db from '../data/index.ts'

export async function rejectGoalReport (goalReportId: number, reviewedBy: number): Promise<void> {
  const goalReport: any = await db.GoalReport.findByPk(goalReportId)
  if (!goalReport) {
    throw new Error('Goal report not found')
  }
  if (goalReport.status !== 'pending') {
    throw new Error('Goal report has already been reviewed')
  }

  await goalReport.update({
    status: 'rejected',
    reviewedBy,
    reviewedAt: new Date(),
  })
}
