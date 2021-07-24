const db = require('../../app/data')
const { updatePlayer, updateKeeper } = require('../../app/dream-league/teamsheet')
const testData = require('../data')

describe('update teamsheet', () => {
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

  beforeEach(async () => {
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.ManagerKeeper.bulkCreate(testData.managerKeepers)
    await db.ManagerPlayer.bulkCreate(testData.managerPlayers)
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

  // payload replaces 574 with 278 for managerId 10
  // sub 260 replaced with 562
  const playerPayload = {
    managerId: '10',
    playerIds: [
      '260', '562', '278',
      '1067', '1194', '1500',
      '1509', '1868', '1911',
      '1916', '1994', '2047',
      '2129'
    ],
    playerSubs: ['562', '1509', '1994']
  }

  test('should add new player', async () => {
    await updatePlayer(playerPayload)
    const { count } = await db.ManagerPlayer.findAndCountAll({ where: { managerId: 10, playerId: 278 } })
    expect(count).toBe(1)
  })

  test('should remove old player', async () => {
    await updatePlayer(playerPayload)
    const { count } = await db.ManagerPlayer.findAndCountAll({ where: { managerId: 10, playerId: 574 } })
    expect(count).toBe(0)
  })

  test('should add new player sub', async () => {
    await updatePlayer(playerPayload)
    const { count } = await db.ManagerPlayer.findAndCountAll({ where: { managerId: 10, playerId: 562, substitute: true } })
    expect(count).toBe(1)
  })

  test('should remove old player sub', async () => {
    await updatePlayer(playerPayload)
    const { count } = await db.ManagerPlayer.findAndCountAll({ where: { managerId: 10, playerId: 260, substitute: true } })
    expect(count).toBe(0)
  })

  // payload replaces 56 with 31 for managerId 10
  const keeperPayload = {
    managerId: '10',
    teamIds: [
      '62', '31'
    ],
    teamSubs: ['31']
  }

  test('should add new keeper', async () => {
    await updateKeeper(keeperPayload)
    const { count } = await db.ManagerKeeper.findAndCountAll({ where: { managerId: 10, teamId: 31 } })
    expect(count).toBe(1)
  })

  test('should remove old keeper', async () => {
    await updateKeeper(keeperPayload)
    const { count } = await db.ManagerKeeper.findAndCountAll({ where: { managerId: 10, teamId: 56 } })
    expect(count).toBe(0)
  })

  test('should add new keeper sub', async () => {
    await updateKeeper(keeperPayload)
    const { count } = await db.ManagerKeeper.findAndCountAll({ where: { managerId: 10, teamId: 31, substitute: true } })
    expect(count).toBe(1)
  })

  test('should remove old keeper sub', async () => {
    await updateKeeper(keeperPayload)
    const { count } = await db.ManagerKeeper.findAndCountAll({ where: { managerId: 10, teamId: 56, substitute: true } })
    expect(count).toBe(0)
  })
})
