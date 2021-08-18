const db = require('../../app/data')
const getTable = require('../../app/results/get-table')
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

  test('should calculate goal difference with equal goals and conceded multiple goals', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 1, cup: false })
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

  test('should calculate negative goal difference over multiple gameweeks', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 2, cup: false })
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 1, cup: false })
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 1, cup: false })
    const result = await getTable(2, managers)
    expect(result.find(x => x.managerId === 11).gd).toBe(-1)
  })

  test('should calculate positive goal difference over multiple gameweeks', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 2, cup: false })
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 1, cup: false })
    const result = await getTable(2, managers)
    expect(result.find(x => x.managerId === 11).gd).toBe(1)
  })

  test('should ignore goals for later gameweeks', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 2, cup: false })
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 1, cup: false })
    const result = await getTable(1, managers)
    expect(result.find(x => x.managerId === 11).gd).toBe(0)
  })

  test('should ignore conceded for later gameweeks', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 1, cup: false })
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 2, cup: false })
    const result = await getTable(1, managers)
    expect(result.find(x => x.managerId === 11).gd).toBe(0)
  })

  test('should return matches played for first gameweek without goals', async () => {
    const result = await getTable(1, managers)
    expect(result.find(x => x.managerId === 11).played).toBe(1)
  })

  test('should return matches played for first gameweek with goals', async () => {
    const result = await getTable(1, managers)
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    expect(result.find(x => x.managerId === 11).played).toBe(1)
  })

  test('should return matches played for first gameweek with conceded', async () => {
    const result = await getTable(1, managers)
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 2, cup: false })
    expect(result.find(x => x.managerId === 11).played).toBe(1)
  })

  test('should return matches played for first gameweek with conceded', async () => {
    const result = await getTable(1, managers)
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 2, cup: false })
    expect(result.find(x => x.managerId === 11).played).toBe(1)
  })

  test('should return matches played for later gameweek', async () => {
    const result = await getTable(4, managers)
    expect(result.find(x => x.managerId === 11).played).toBe(4)
  })

  test('should return 3 points for a win', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    const result = await getTable(1, managers)
    expect(result.find(x => x.managerId === 11).points).toBe(3)
  })

  test('should return 1 point for a 0-0 draw', async () => {
    const result = await getTable(1, managers)
    expect(result.find(x => x.managerId === 11).points).toBe(1)
  })

  test('should return 1 point for a score draw', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 1, cup: false })
    const result = await getTable(1, managers)
    expect(result.find(x => x.managerId === 11).points).toBe(1)
  })

  test('should return 0 points for a defeat', async () => {
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 1, cup: false })
    const result = await getTable(1, managers)
    expect(result.find(x => x.managerId === 11).points).toBe(0)
  })

  test('should return 4 points for a win and then score draw', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    const result = await getTable(2, managers)
    expect(result.find(x => x.managerId === 11).points).toBe(4)
  })

  test('should return 4 points for a win and then 0-0 draw', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    const result = await getTable(2, managers)
    expect(result.find(x => x.managerId === 11).points).toBe(4)
  })

  test('should return 6 points for two wins', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 2, cup: false })
    const result = await getTable(2, managers)
    expect(result.find(x => x.managerId === 11).points).toBe(6)
  })

  test('should return 7 points for two wins, a draw and a defeat', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 2, cup: false })
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 4, cup: false })
    const result = await getTable(4, managers)
    expect(result.find(x => x.managerId === 11).points).toBe(7)
  })

  test('should order most points at top', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    const result = await getTable(1, managers)
    expect(result[0].managerId).toBe(11)
  })

  test('should order least points at bottom', async () => {
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 1, cup: false })
    const result = await getTable(1, managers)
    expect(result[result.length - 1].managerId).toBe(11)
  })

  test('should order by goal difference if points even', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 295, managerId: 2, gameweekId: 1, cup: false })
    const result = await getTable(1, managers)
    expect(result[0].managerId).toBe(11)
  })

  test('should order by goals for if difference even', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Concede.create({ playerId: 60, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 295, managerId: 2, gameweekId: 1, cup: false })
    const result = await getTable(1, managers)
    expect(result[0].managerId).toBe(11)
  })

  test('should order alphabetically if all even', async () => {
    const result = await getTable(1, managers)
    expect(result[0].managerId).toBe(11)
  })

  test('should set position', async () => {
    const result = await getTable(1, managers)
    expect(result[0].position).toBe(1)
    expect(result[1].position).toBe(2)
    expect(result[2].position).toBe(3)
    expect(result[3].position).toBe(4)
    expect(result[4].position).toBe(5)
  })
})
