const db = require('../../app/data')
const { createSummary } = require('../../app/results/create-summary')
const testData = require('../data')

describe('get table', () => {
  beforeAll(async () => {
    await db.Concede.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.Player.destroy({ truncate: true })
    await db.Gameweek.destroy({ truncate: true })
    await db.Manager.bulkCreate(testData.managers)
    await db.Team.bulkCreate(testData.teams)
    await db.Player.bulkCreate(testData.players)
    await db.ManagerKeeper.bulkCreate(testData.managerKeepers)
    await db.ManagerPlayer.bulkCreate(testData.managerPlayers)
    await db.Gameweek.bulkCreate(testData.gameweeks)
  })

  afterAll(async () => {
    await db.Concede.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Player.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.Gameweek.destroy({ truncate: true })
    await db.sequelize.close()
  })

  test('should create summary for game week', async () => {
    await createSummary(1)
    const result = await db.Summary.findAll({ where: { gameweekId: 1 } })
    expect(result.length).toBe(1)
  })

  test('should overwrite summary for existing game week', async () => {
    await createSummary(1)
    await createSummary(1)
    const result = await db.Summary.findAll({ where: { gameweekId: 1 } })
    expect(result.length).toBe(1)
  })

  test('should include gameweekId', async () => {
    await createSummary(1)
    const result = await db.Summary.findAll({ where: { gameweekId: 1 } })
    expect(result[0].gameweekId).toBe(1)
  })

  test('should include scores', async () => {
    await createSummary(1)
    const result = await db.Summary.findAll({ where: { gameweekId: 1 } })
    expect(Array.isArray(result[0].summary.scores)).toBe(true)
  })

  test('should include scorers', async () => {
    await createSummary(1)
    const result = await db.Summary.findAll({ where: { gameweekId: 1 } })
    expect(Array.isArray(result[0].summary.scores[0].scorers)).toBe(true)
  })

  test('should include table', async () => {
    await createSummary(1)
    const result = await db.Summary.findAll({ where: { gameweekId: 1 } })
    expect(Array.isArray(result[0].summary.table)).toBe(true)
  })
})
