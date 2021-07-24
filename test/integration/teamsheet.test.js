const db = require('../../app/data')
const { get } = require('../../app/dream-league/teamsheet')
const testData = require('../data')

describe('get teamsheet', () => {
  beforeAll(async () => {
    await db.Teamsheet.destroy({ truncate: true })
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
    await db.Teamsheet.bulkCreate(testData.teamsheet)
  })

  afterAll(async () => {
    await db.Teamsheet.destroy({ truncate: true })
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Player.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.sequelize.close()
  })

  test('should return all managers', async () => {
    const result = await get()
    expect(result.length).toBe(13)
  })

  test('should return all players', async () => {
    const result = await get()
    const manager = result.find(x => x.managerId === 1)
    expect(manager.players.length).toBe(13)
  })

  test('should return all keepers', async () => {
    const result = await get()
    const manager = result.find(x => x.managerId === 1)
    expect(manager.keepers.length).toBe(2)
  })

  test('should return empty array if no players', async () => {
    const result = await get()
    const manager = result.find(x => x.managerId === 13)
    expect(manager.players.length).toBe(0)
  })

  test('should return empty array if no keepers', async () => {
    const result = await get()
    const manager = result.find(x => x.managerId === 13)
    expect(manager.keepers.length).toBe(0)
  })
})
