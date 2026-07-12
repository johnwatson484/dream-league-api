import db from '../../src/data/index.ts'
import { rejectGoalReport } from '../../src/goal-reports/reject-goal-report.ts'
import testData from '../data/index.ts'

describe('reject goal report', () => {
  beforeAll(async () => {
    await db.GoalReport.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Player.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.Gameweek.destroy({ truncate: true })
    await db.Team.bulkCreate(testData.teams)
    await db.Player.bulkCreate(testData.players)
    await db.Manager.bulkCreate(testData.managers)
    await db.ManagerPlayer.bulkCreate(testData.managerPlayers)
    await db.Gameweek.bulkCreate(testData.gameweeks)
  })

  afterAll(async () => {
    await db.GoalReport.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Player.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.Gameweek.destroy({ truncate: true })
    await db.sequelize.close()
  })

  beforeEach(async () => {
    await db.GoalReport.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
  })

  test('sets status to rejected with reviewer info', async () => {
    const managerPlayer = testData.managerPlayers[0]

    const goalReport: any = await db.GoalReport.create({
      playerId: managerPlayer.playerId,
      managerId: managerPlayer.managerId,
      gameweekId: 1,
      goals: 2,
      goalsCup: 0,
      status: 'pending',
      submittedBy: 1,
      created: new Date(),
    })

    await rejectGoalReport(goalReport.goalReportId, 99)

    const updatedRequest: any = await db.GoalReport.findByPk(goalReport.goalReportId)
    expect(updatedRequest.status).toBe('rejected')
    expect(updatedRequest.reviewedBy).toBe(99)
    expect(updatedRequest.reviewedAt).toBeDefined()
  })

  test('does not create any goal records', async () => {
    const managerPlayer = testData.managerPlayers[0]

    const goalReport: any = await db.GoalReport.create({
      playerId: managerPlayer.playerId,
      managerId: managerPlayer.managerId,
      gameweekId: 1,
      goals: 3,
      goalsCup: 0,
      status: 'pending',
      submittedBy: 1,
      created: new Date(),
    })

    await rejectGoalReport(goalReport.goalReportId, 99)

    const goals = await db.Goal.findAll({ where: { gameweekId: 1 } })
    expect(goals).toHaveLength(0)
  })

  test('rejects if goal report not found', async () => {
    await expect(rejectGoalReport(9999, 99)).rejects.toThrow('Goal report not found')
  })

  test('rejects if already reviewed', async () => {
    const managerPlayer = testData.managerPlayers[0]

    const goalReport: any = await db.GoalReport.create({
      playerId: managerPlayer.playerId,
      managerId: managerPlayer.managerId,
      gameweekId: 1,
      goals: 1,
      goalsCup: 0,
      status: 'rejected',
      submittedBy: 1,
      reviewedBy: 99,
      reviewedAt: new Date(),
      created: new Date(),
    })

    await expect(rejectGoalReport(goalReport.goalReportId, 99))
      .rejects.toThrow('Goal report has already been reviewed')
  })
})
