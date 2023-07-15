const db = require('../../app/data')
const { getScores } = require('../../app/results/get-scores')
const testData = require('../data')
let managers

describe('get scores', () => {
  beforeAll(async () => {
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

  test('should return scores for all managers', async () => {
    const result = await getScores(1, managers)
    expect(result.length).toBe(13)
  })

  test('should return goal for manager', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).goals).toBe(1)
  })

  test('should return multiple goals for manager', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).goals).toBe(2)
  })

  test('should return conceded for manager', async () => {
    await db.Concede.create({ teamId: 60, managerId: 11, gameweekId: 1, cup: false })
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).conceded).toBe(1)
  })

  test('should return multiple conceded for manager', async () => {
    await db.Concede.create({ teamId: 60, managerId: 11, gameweekId: 1, cup: false })
    await db.Concede.create({ teamId: 60, managerId: 11, gameweekId: 1, cup: false })
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).conceded).toBe(2)
  })

  test('should return win for 1-0', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).result).toBe('W')
  })

  test('should return win for 2-0', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).result).toBe('W')
  })

  test('should return win for 2-1', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Concede.create({ teamId: 60, managerId: 11, gameweekId: 1, cup: false })
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).result).toBe('W')
  })

  test('should return draw for 0-0', async () => {
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).result).toBe('D')
  })

  test('should return draw for 1-1', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Concede.create({ teamId: 60, managerId: 11, gameweekId: 1, cup: false })
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).result).toBe('D')
  })

  test('should return draw for 2-2', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Concede.create({ teamId: 60, managerId: 11, gameweekId: 1, cup: false })
    await db.Concede.create({ teamId: 60, managerId: 11, gameweekId: 1, cup: false })
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).result).toBe('D')
  })

  test('should return loss for 0-1', async () => {
    await db.Concede.create({ teamId: 60, managerId: 11, gameweekId: 1, cup: false })
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).result).toBe('L')
  })

  test('should return loss for 0-2', async () => {
    await db.Concede.create({ teamId: 60, managerId: 11, gameweekId: 1, cup: false })
    await db.Concede.create({ teamId: 60, managerId: 11, gameweekId: 1, cup: false })
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).result).toBe('L')
  })

  test('should return loss for 1-2', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Concede.create({ teamId: 60, managerId: 11, gameweekId: 1, cup: false })
    await db.Concede.create({ teamId: 60, managerId: 11, gameweekId: 1, cup: false })
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).result).toBe('L')
  })

  test('should return correct number of scorers', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).scorers.length).toBe(1)
  })

  test('should return correct number of scorers when multiple', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 369, managerId: 11, gameweekId: 1, cup: false })
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).scorers.length).toBe(2)
  })

  test('should return correct scorer', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).scorers[0].playerId).toBe(773)
  })

  test('should return correct number of scorer goals', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).scorers[0].goals).toBe(1)
  })

  test('should return correct number of scorer goals when multiple scorers', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 369, managerId: 11, gameweekId: 1, cup: false })
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).scorers.find(x => x.playerId === 773).goals).toBe(1)
    expect(result.find(x => x.managerId === 11).scorers.find(x => x.playerId === 369).goals).toBe(1)
  })

  test('should return correct number of scorer goals when multiple goals', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).scorers[0].goals).toBe(2)
  })

  test('should return correct number of scorer goals when multiple scorers and goals', async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 369, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 369, managerId: 11, gameweekId: 1, cup: false })
    const result = await getScores(1, managers)
    expect(result.find(x => x.managerId === 11).scorers.find(x => x.playerId === 773).goals).toBe(2)
    expect(result.find(x => x.managerId === 11).scorers.find(x => x.playerId === 369).goals).toBe(2)
  })
})
