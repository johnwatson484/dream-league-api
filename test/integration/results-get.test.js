const db = require('../../app/data/models')
const { getInput } = require('../../app/dream-league/results')
const testData = require('../data')

describe('get results input', () => {
  beforeAll(async () => {
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
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Player.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.sequelize.close()
  })

  test('should return all non sub keepers', async () => {
    const result = await getInput()
    expect(result.keepers.length).toBe(11)
  })

  test('should return all non sub players', async () => {
    const result = await getInput()
    expect(result.players.length).toBe(110)
  })
})
