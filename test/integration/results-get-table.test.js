const db = require('../../app/data/models')
const getTable = require('../../app/dream-league/results/get-table')
const testData = require('../data')
let managers

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
    managers = await db.Manager.findAll()
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

  beforeEach(async () => {
    await db.Concede.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
  })

  afterEach(async () => {
    await db.Concede.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
  })

  test('should return row for all managers', async () => {
    const result = await getTable(1, managers)
    expect(result.length).toBe(13)
  })

  test('should return goal for manager', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    const result = await getTable(1, managers)
    expect(result.find(x => x.managerId === 11).gf).toBe(1)
  })

  test('should return conceded for manager', async () => {
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 1, cup: false })
    const result = await getTable(1, managers)
    expect(result.find(x => x.managerId === 11).ga).toBe(1)
  })

  test('should calculate goal difference with no goals', async () => {
    const result = await getTable(1, managers)
    expect(result.find(x => x.managerId === 11).gd).toBe(0)
  })

  test('should calculate goal difference with equal goals and conceded', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 1, cup: false })
    const result = await getTable(1, managers)
    expect(result.find(x => x.managerId === 11).gd).toBe(0)
  })

  test('should calculate positive goal difference to none conceded', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    const result = await getTable(1, managers)
    expect(result.find(x => x.managerId === 11).gd).toBe(1)
  })

  test('should calculate positive goal difference with conceded', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 1, cup: false })
    const result = await getTable(1, managers)
    expect(result.find(x => x.managerId === 11).gd).toBe(1)
  })

  test('should calculate negative goal difference with none scored', async () => {
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 1, cup: false })
    const result = await getTable(1, managers)
    expect(result.find(x => x.managerId === 11).gd).toBe(-1)
  })

  test('should calculate negative goal difference with scored', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 1, cup: false })
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 1, cup: false })
    const result = await getTable(1, managers)
    expect(result.find(x => x.managerId === 11).gd).toBe(-1)
  })
})
