const db = require('../../app/data/models')
const refresh = require('../../app/league/player-refresh')

describe('refreshing player list', () => {
  beforeAll(async () => {
    await db.Team.destroy({ truncate: true })
    await db.Team.bulkCreate([{
      teamId: 1,
      divisionId: 1,
      name: 'Rochdale',
      alias: 'Rochdale'
    }, {
      teamId: 2,
      divisionId: 1,
      name: 'Wycombe Wanderers',
      alias: 'Wycombe'
    }])
  })

  beforeEach(async () => {
    await db.Player.destroy({ truncate: true })
  })

  afterAll(async () => {
    await db.Team.destroy({ truncate: true })
    await db.sequelize.close()
  })

  test('should return success if list valid', async () => {
    const players = [{
      firstName: 'Ian',
      lastName: 'Henderson',
      position: 'FWD',
      team: 'Rochdale'
    }, {
      firstName: 'Adebayo',
      lastName: 'Akinfenwa',
      position: 'FWD',
      team: 'Wycombe'
    }]

    const result = await refresh(players)

    expect(result.success).toBeTruthy()
    expect(result.unmappedPlayers).toBeUndefined()
  })

  test('should return failure if all teams invalid', async () => {
    const players = [{
      firstName: 'Ian',
      lastName: 'Henderson',
      position: 'FWD',
      team: 'Rochdal'
    }, {
      firstName: 'Adebayo',
      lastName: 'Akinfenwa',
      position: 'FWD',
      team: 'Wycomb'
    }]

    const result = await refresh(players)

    expect(result.success).toBeFalsy()
    expect(result.unmappedPlayers.length).toBe(2)
  })

  test('should return failure if some teams invalid', async () => {
    const players = [{
      firstName: 'Ian',
      lastName: 'Henderson',
      position: 'FWD',
      team: 'Rochdale'
    }, {
      firstName: 'Adebayo',
      lastName: 'Akinfenwa',
      position: 'FWD',
      team: 'Wycomb'
    }]

    const result = await refresh(players)

    expect(result.success).toBeFalsy()
    expect(result.unmappedPlayers.length).toBe(1)
  })

  test('should not refresh partial list invalid', async () => {
    const players = [{
      firstName: 'Ian',
      lastName: 'Henderson',
      position: 'FWD',
      team: 'Rochdale'
    }, {
      firstName: 'Adebayo',
      lastName: 'Akinfenwa',
      position: 'FWD',
      team: 'Wycomb'
    }]

    await refresh(players)

    const { count } = await db.Player.findAndCountAll()
    expect(count).toBe(0)
  })

  test('should return failure if position invalid', async () => {
    const result = await refresh([{
      firstName: 'Ian',
      lastName: 'Henderson',
      position: 'ST',
      team: 'Rochdale'
    }])

    expect(result.success).toBeFalsy()
    expect(result.unmappedPlayers.length).toBe(1)
  })
})
