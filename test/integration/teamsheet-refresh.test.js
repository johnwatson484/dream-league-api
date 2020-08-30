const db = require('../../app/data/models')
const refresh = require('../../app/dream-league/teamsheet-refresh')
const testData = require('../data')

describe('refreshing teamsheet', () => {
  beforeAll(async () => {
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.Player.destroy({ truncate: true })
    await db.Manager.bulkCreate(testData.managers)
    await db.Team.bulkCreate(testData.teams)
    await db.Player.bulkCreate(testData.players)
  })

  beforeEach(async () => {
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
  })

  afterAll(async () => {
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Player.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.sequelize.close()
  })

  test('should return success if list valid', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Henderson - Rochdale',
        position: 'FWD',
        substitute: false
      }]
    }]

    const result = await refresh(teams)

    expect(result.success).toBeTruthy()
  })

  test('should save players if list valid', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Henderson - Rochdale',
        position: 'FWD',
        substitute: false
      }]
    }]

    await refresh(teams)
    const savedPlayers = await db.ManagerPlayer.findAll({ include: [{ model: db.Player, include: [{ model: db.Team, as: 'team' }] }], raw: true, nest: true })
    console.log(savedPlayers)
    expect(savedPlayers.filter(x => x.Player.firstName === 'Ian' && x.Player.lastName === 'Henderson' && x.Player.team.name === 'Rochdale').length).toBe(1)
  })

  // test('should replace existing players if list valid', async () => {
  //   const originalPlayer = {
  //     firstName: 'Lee',
  //     lastName: 'Gregory',
  //     position: 'Forward',
  //     teamId: 1
  //   }

  //   await db.Player.create(originalPlayer)

  //   const players = [{
  //     firstName: 'Ian',
  //     lastName: 'Henderson',
  //     position: 'FWD',
  //     team: 'Rochdale'
  //   }, {
  //     firstName: 'Adebayo',
  //     lastName: 'Akinfenwa',
  //     position: 'FWD',
  //     team: 'Wycombe'
  //   }]

  //   await refresh(players)
  //   const savedPlayers = await db.Player.findAll()

  //   expect(savedPlayers.filter(x => x.firstName === players[0].firstName && x.lastName === players[0].lastName).length).toBe(1)
  //   expect(savedPlayers.filter(x => x.firstName === players[1].firstName && x.lastName === players[1].lastName).length).toBe(1)
  //   expect(savedPlayers.filter(x => x.firstName === originalPlayer.firstName && x.lastName === originalPlayer.lastName).length).toBe(0)
  // })

  // test('should not be case sensitive', async () => {
  //   const players = [{
  //     firstName: 'Ian',
  //     lastName: 'Henderson',
  //     position: 'FWD',
  //     team: 'rochdale'
  //   }, {
  //     firstName: 'Adebayo',
  //     lastName: 'Akinfenwa',
  //     position: 'FWD',
  //     team: 'WycoMbe'
  //   }]

  //   const result = await refresh(players)

  //   expect(result.success).toBeTruthy()
  // })

  // test('should return failure if all teams invalid', async () => {
  //   const players = [{
  //     firstName: 'Ian',
  //     lastName: 'Henderson',
  //     position: 'FWD',
  //     team: 'Rochdal'
  //   }, {
  //     firstName: 'Adebayo',
  //     lastName: 'Akinfenwa',
  //     position: 'FWD',
  //     team: 'Wycomb'
  //   }]

  //   const result = await refresh(players)

  //   expect(result.success).toBeFalsy()
  //   expect(result.unmappedPlayers.length).toBe(2)
  // })

  // test('should return failure if some teams invalid', async () => {
  //   const players = [{
  //     firstName: 'Ian',
  //     lastName: 'Henderson',
  //     position: 'FWD',
  //     team: 'Rochdale'
  //   }, {
  //     firstName: 'Adebayo',
  //     lastName: 'Akinfenwa',
  //     position: 'FWD',
  //     team: 'Wycomb'
  //   }]

  //   const result = await refresh(players)

  //   expect(result.success).toBeFalsy()
  //   expect(result.unmappedPlayers.length).toBe(1)
  // })

  // test('should not refresh partial list invalid', async () => {
  //   const players = [{
  //     firstName: 'Ian',
  //     lastName: 'Henderson',
  //     position: 'FWD',
  //     team: 'Rochdale'
  //   }, {
  //     firstName: 'Adebayo',
  //     lastName: 'Akinfenwa',
  //     position: 'FWD',
  //     team: 'Wycomb'
  //   }]

  //   await refresh(players)

  //   const { count } = await db.Player.findAndCountAll()
  //   expect(count).toBe(0)
  // })

  // test('should return failure if position invalid', async () => {
  //   const result = await refresh([{
  //     firstName: 'Ian',
  //     lastName: 'Henderson',
  //     position: 'ST',
  //     team: 'Rochdale'
  //   }])

  //   expect(result.success).toBeFalsy()
  //   expect(result.unmappedPlayers.length).toBe(1)
  // })
})
