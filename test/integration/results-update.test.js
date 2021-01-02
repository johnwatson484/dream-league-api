const db = require('../../app/data/models')
const { update } = require('../../app/dream-league/results')
const testData = require('../data')

describe('get results input', () => {
  beforeAll(async () => {
    await db.Summary.destroy({ truncate: true })
    await db.Concede.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.Player.destroy({ truncate: true })
    await db.Manager.bulkCreate(testData.managers)
    await db.Team.bulkCreate(testData.teams)
    await db.Player.bulkCreate(testData.players)
    await db.ManagerKeeper.bulkCreate(testData.managerKeepers)
    await db.ManagerPlayer.bulkCreate(testData.managerPlayers)
  })

  afterAll(async () => {
    await db.Summary.destroy({ truncate: true })
    await db.Concede.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Player.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.sequelize.close()
  })

  beforeEach(async () => {
    await db.Summary.destroy({ truncate: true })
    await db.Concede.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
  })

  afterEach(async () => {
    await db.Summary.destroy({ truncate: true })
    await db.Concede.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
  })

  const results = {
    gameweekId: 1,
    conceded: [{
      teamId: 65,
      conceded: 0
    }, {
      teamId: 60,
      conceded: 1
    }, {
      teamId: 28,
      conceded: 2
    }, {
      teamId: 1,
      conceded: 1
    }],
    goals: [{
      playerId: 2156,
      goals: 0
    }, {
      playerId: 773,
      goals: 1
    }, {
      playerId: 291,
      goals: 2
    }, {
      playerId: 1,
      goals: 1
    }]
  }

  test('should add conceded for team conceding one', async () => {
    await update(results)
    const result = await db.Concede.findAll({ where: { teamId: 60 } })
    expect(result.length).toBe(1)
  })

  test('should add conceded for team conceding multiple', async () => {
    await update(results)
    const result = await db.Concede.findAll({ where: { teamId: 28 } })
    expect(result.length).toBe(2)
  })

  test('should not add conceded for team conceding none', async () => {
    await update(results)
    const result = await db.Concede.findAll({ where: { teamId: 65 } })
    expect(result.length).toBe(0)
  })

  test('should not add conceded for team conceding with no manager', async () => {
    await update(results)
    const result = await db.Concede.findAll({ where: { teamId: 1 } })
    expect(result.length).toBe(0)
  })

  test('should add gameweek for conceded', async () => {
    await update(results)
    const result = await db.Concede.findAll()
    expect(result.filter(x => x.gameweekId === 1).length).toBe(result.length)
  })

  test('should add manager for conceded', async () => {
    await update(results)
    const result = await db.Concede.findAll({ where: { teamId: 28, managerId: 2 } })
    expect(result.length).toBe(2)
  })

  test('should add goal for player scoring one', async () => {
    await update(results)
    const result = await db.Goal.findAll({ where: { playerId: 773 } })
    expect(result.length).toBe(1)
  })

  test('should add goals for player scoring multiple', async () => {
    await update(results)
    const result = await db.Goal.findAll({ where: { playerId: 291 } })
    expect(result.length).toBe(2)
  })

  test('should not add goal for player scoring none', async () => {
    await update(results)
    const result = await db.Goal.findAll({ where: { playerId: 2156 } })
    expect(result.length).toBe(0)
  })

  test('should not add goals for player with no manager', async () => {
    await update(results)
    const result = await db.Goal.findAll({ where: { playerId: 1 } })
    expect(result.length).toBe(0)
  })

  test('should add gameweek for goal', async () => {
    await update(results)
    const result = await db.Goal.findAll()
    expect(result.filter(x => x.gameweekId === 1).length).toBe(result.length)
  })

  test('should add manager for goal', async () => {
    await update(results)
    const result = await db.Goal.findAll({ where: { playerId: 291, managerId: 3 } })
    expect(result.length).toBe(2)
  })
})
