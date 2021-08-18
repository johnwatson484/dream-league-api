const db = require('../../app/data')
const { getTopScorers } = require('../../app/statistics')
const testData = require('../data')

describe('get top goalscorers', () => {
  beforeAll(async () => {
    await db.Player.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Gameweek.destroy({ truncate: true })
    await db.Manager.bulkCreate(testData.managers)
    await db.Team.bulkCreate(testData.teams)
    await db.Player.bulkCreate(testData.players)
    await db.ManagerPlayer.bulkCreate(testData.managerPlayers)
    await db.Gameweek.bulkCreate(testData.gameweeks)
  })

  afterAll(async () => {
    await db.Player.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Gameweek.destroy({ truncate: true })
    await db.sequelize.close()
  })

  beforeEach(async () => {
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 773, managerId: 11, gameweekId: 1, cup: false })
    await db.Goal.create({ playerId: 295, managerId: 2, gameweekId: 1, cup: false })
  })

  afterEach(async () => {
    await db.Goal.destroy({ truncate: true })
  })

  test('should return all scorers', async () => {
    const result = await getTopScorers()
    expect(result.length).toBe(2)
  })

  test('should calculate goals', async () => {
    const result = await getTopScorers()
    expect(result.find(x => x.playerId === 773).goals).toBe(2)
    expect(result.find(x => x.playerId === 295).goals).toBe(1)
  })

  test('should order scorers', async () => {
    const result = await getTopScorers()
    expect(result[0].goals).toBe(2)
    expect(result[1].goals).toBe(1)
  })
})
