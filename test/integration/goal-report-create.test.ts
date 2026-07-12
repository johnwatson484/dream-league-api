import db from '../../src/data/index.ts'
import { createGoalReport } from '../../src/goal-reports/create-goal-report.ts'
import testData from '../data/index.ts'

describe('create goal report', () => {
  beforeAll(async () => {
    await db.GoalReport.destroy({ truncate: true })
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
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Player.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.Gameweek.destroy({ truncate: true })
    await db.sequelize.close()
  })

  afterEach(async () => {
    await db.GoalReport.destroy({ truncate: true })
  })

  test('creates a pending goal report when player belongs to manager', async () => {
    const managerPlayer = testData.managerPlayers[0]

    const result: any = await createGoalReport({
      playerId: managerPlayer.playerId,
      managerId: managerPlayer.managerId,
      gameweekId: 1,
      goals: 2,
      goalsCup: 0,
      reason: 'Missed from results sheet',
      submittedBy: 1,
    })

    expect(result.goalReportId).toBeDefined()
    expect(result.status).toBe('pending')
    expect(result.goals).toBe(2)
    expect(result.goalsCup).toBe(0)
    expect(result.playerId).toBe(managerPlayer.playerId)
    expect(result.managerId).toBe(managerPlayer.managerId)
    expect(result.gameweekId).toBe(1)
    expect(result.reason).toBe('Missed from results sheet')
  })

  test('rejects when player does not belong to manager', async () => {
    await expect(createGoalReport({
      playerId: testData.managerPlayers[0].playerId,
      managerId: 99,
      gameweekId: 1,
      goals: 1,
      goalsCup: 0,
      submittedBy: 1,
    })).rejects.toThrow('Player does not belong to the selected manager')
  })

  test('rejects when gameweek does not exist', async () => {
    const managerPlayer = testData.managerPlayers[0]

    await expect(createGoalReport({
      playerId: managerPlayer.playerId,
      managerId: managerPlayer.managerId,
      gameweekId: 9999,
      goals: 1,
      goalsCup: 0,
      submittedBy: 1,
    })).rejects.toThrow('Gameweek not found')
  })
})
