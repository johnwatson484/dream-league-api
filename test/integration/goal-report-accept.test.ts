import db from '../../src/data/index.ts'
import { acceptGoalReport } from '../../src/goal-reports/accept-goal-report.ts'
import testData from '../data/index.ts'

describe('accept goal report', () => {
  beforeAll(async () => {
    await db.Summary.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
    await db.Concede.destroy({ truncate: true })
    await db.GoalReport.destroy({ truncate: true })
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Player.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.Gameweek.destroy({ truncate: true })
    await db.Team.bulkCreate(testData.teams)
    await db.Player.bulkCreate(testData.players)
    await db.Manager.bulkCreate(testData.managers)
    await db.ManagerPlayer.bulkCreate(testData.managerPlayers)
    await db.ManagerKeeper.bulkCreate(testData.managerKeepers)
    await db.Gameweek.bulkCreate(testData.gameweeks)
  })

  afterAll(async () => {
    await db.Summary.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
    await db.Concede.destroy({ truncate: true })
    await db.GoalReport.destroy({ truncate: true })
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Player.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.Gameweek.destroy({ truncate: true })
    await db.sequelize.close()
  })

  beforeEach(async () => {
    await db.Summary.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
    await db.Concede.destroy({ truncate: true })
    await db.GoalReport.destroy({ truncate: true })
  })

  test('creates league goal records and regenerates summary on acceptance', async () => {
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

    await acceptGoalReport(goalReport.goalReportId, 99)

    const updatedRequest: any = await db.GoalReport.findByPk(goalReport.goalReportId)
    expect(updatedRequest.status).toBe('approved')
    expect(updatedRequest.reviewedBy).toBe(99)
    expect(updatedRequest.reviewedAt).toBeDefined()

    const goals = await db.Goal.findAll({ where: { gameweekId: 1, playerId: managerPlayer.playerId } })
    expect(goals).toHaveLength(2)
    goals.forEach((goal: any) => {
      expect(goal.cup).toBe(false)
      expect(goal.createdBy).toBe('goal-report')
      expect(goal.managerId).toBe(managerPlayer.managerId)
    })

    const summary: any = await db.Summary.findByPk(1)
    expect(summary).toBeDefined()
  })

  test('creates cup goal records when goalsCup is set', async () => {
    const managerPlayer = testData.managerPlayers[0]

    const goalReport: any = await db.GoalReport.create({
      playerId: managerPlayer.playerId,
      managerId: managerPlayer.managerId,
      gameweekId: 1,
      goals: 1,
      goalsCup: 3,
      status: 'pending',
      submittedBy: 1,
      created: new Date(),
    })

    await acceptGoalReport(goalReport.goalReportId, 99)

    const leagueGoals = await db.Goal.findAll({ where: { gameweekId: 1, playerId: managerPlayer.playerId, cup: false } })
    expect(leagueGoals).toHaveLength(1)

    const cupGoals = await db.Goal.findAll({ where: { gameweekId: 1, playerId: managerPlayer.playerId, cup: true } })
    expect(cupGoals).toHaveLength(3)
  })

  test('rejects if goal report not found', async () => {
    await expect(acceptGoalReport(9999, 99)).rejects.toThrow('Goal report not found')
  })

  test('rejects if goal report already reviewed', async () => {
    const managerPlayer = testData.managerPlayers[0]

    const goalReport: any = await db.GoalReport.create({
      playerId: managerPlayer.playerId,
      managerId: managerPlayer.managerId,
      gameweekId: 1,
      goals: 1,
      goalsCup: 0,
      status: 'approved',
      submittedBy: 1,
      reviewedBy: 99,
      reviewedAt: new Date(),
      created: new Date(),
    })

    await expect(acceptGoalReport(goalReport.goalReportId, 99))
      .rejects.toThrow('Goal report has already been reviewed')
  })
})
