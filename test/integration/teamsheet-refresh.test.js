const db = require('../../app/data')
const { refreshTeamsheet } = require('../../app/refresh')
const testData = require('../data')

describe('refreshing teamsheet', () => {
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
  })

  beforeEach(async () => {
    await db.Teamsheet.destroy({ truncate: true })
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
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

  test('should return success if list valid', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Henderson - Rochdale',
        position: 'FWD',
        substitute: false,
      }],
    }]

    const result = await refreshTeamsheet(teams)

    expect(result.success).toBeTruthy()
  })

  test('should save players if list valid', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Henderson - Rochdale',
        position: 'FWD',
        substitute: false,
      }],
    }]

    await refreshTeamsheet(teams)
    const savedPlayers = await db.ManagerPlayer.findAll({ include: [{ model: db.Player, include: [{ model: db.Team, as: 'team' }] }], raw: true, nest: true })

    expect(savedPlayers.filter(x => x.Player.firstName === 'Ian' && x.Player.lastName === 'Henderson' && x.Player.team.name === 'Rochdale').length).toBe(1)
  })

  test('should save keepers if list valid', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Rochdale',
        position: 'GK',
        substitute: false,
      }],
    }]

    await refreshTeamsheet(teams)
    const savedPlayers = await db.ManagerKeeper.findAll({ include: [{ model: db.Team }], raw: true, nest: true })

    expect(savedPlayers.filter(x => x.Team.name === 'Rochdale').length).toBe(1)
  })

  test('should replace existing players if list valid', async () => {
    const originalPlayer = {
      managerId: 1,
      playerId: 1,
      substitute: false,
    }

    await db.ManagerPlayer.create(originalPlayer)

    const teams = [{
      manager: 'John',
      players: [{
        player: 'Henderson - Rochdale',
        position: 'FWD',
        substitute: false,
      }],
    }]

    await refreshTeamsheet(teams)
    const savedPlayers = await db.ManagerPlayer.findAll({ include: [{ model: db.Player, include: [{ model: db.Team, as: 'team' }] }], raw: true, nest: true })

    expect(savedPlayers.filter(x => x.Player.firstName === 'Ian' && x.Player.lastName === 'Henderson' && x.Player.team.name === 'Rochdale').length).toBe(1)
    expect(savedPlayers.length).toBe(1)
  })

  test('should not be case sensitive', async () => {
    const teams = [{
      manager: 'JoHn',
      players: [{
        player: 'HenDersOn - RocHdaLe',
        position: 'FWD',
        substitute: false,
      }],
    }]

    await refreshTeamsheet(teams)
    const savedPlayers = await db.ManagerPlayer.findAll({ include: [{ model: db.Player, include: [{ model: db.Team, as: 'team' }] }], raw: true, nest: true })

    expect(savedPlayers.filter(x => x.Player.firstName === 'Ian' && x.Player.lastName === 'Henderson' && x.Player.team.name === 'Rochdale').length).toBe(1)
  })

  test('should not save players if invalid manager', async () => {
    const teams = [{
      manager: 'Eric',
      players: [{
        player: 'Henderson - Rochdale',
        position: 'FWD',
        substitute: false,
      }],
    }]

    await refreshTeamsheet(teams)
    const savedPlayers = await db.ManagerPlayer.findAll({ include: [{ model: db.Player, include: [{ model: db.Team, as: 'team' }] }], raw: true, nest: true })

    expect(savedPlayers.filter(x => x.Player.firstName === 'Ian' && x.Player.lastName === 'Henderson' && x.Player.team.name === 'Rochdale').length).toBe(0)
  })

  test('should update teamsheet player data', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Henderson - Rochdale',
        position: 'FWD',
        substitute: false,
      }],
    }]

    await refreshTeamsheet(teams)
    const teamsheet = await db.Teamsheet.findAll({ raw: true })
    expect(teamsheet.filter(x => x.managerId === 1 && x.player === teams[0].players[0].player && x.position === 'Forward').length).toBe(1)
    expect(teamsheet.length).toBe(1)
  })

  test('should update teamsheet keeper data', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Rochdale',
        position: 'GK',
        substitute: false,
      }],
    }]

    await refreshTeamsheet(teams)
    const teamsheet = await db.Teamsheet.findAll({ raw: true })
    expect(teamsheet.filter(x => x.managerId === 1 && x.player === teams[0].players[0].player && x.position === 'Goalkeeper').length).toBe(1)
    expect(teamsheet.length).toBe(1)
  })

  test('should save multiple players', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Henderson - Rochdale',
        position: 'FWD',
        substitute: false,
      }, {
        player: 'Akinfenwa - Wycombe',
        position: 'FWD',
        substitute: false,
      }, {
        player: 'Brighton',
        position: 'GK',
        substitute: false,
      }],
    }]

    await refreshTeamsheet(teams)
    const savedPlayers = await db.ManagerPlayer.findAll({ raw: true })
    const savedKeepers = await db.ManagerKeeper.findAll({ raw: true })

    expect(savedPlayers.length).toBe(2)
    expect(savedKeepers.length).toBe(1)
  })

  test('should save multiple managers', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Henderson - Rochdale',
        position: 'FWD',
        substitute: false,
      }, {
        player: 'Akinfenwa - Wycombe',
        position: 'FWD',
        substitute: false,
      }, {
        player: 'Brighton',
        position: 'GK',
        substitute: false,
      }],
    }, {
      manager: 'Lee',
      players: [{
        player: 'Davenport - Blackburn',
        position: 'MID',
        substitute: false,
      }, {
        player: 'Feeney - Blackpool',
        position: 'MID',
        substitute: false,
      }, {
        player: 'Charlton',
        position: 'GK',
        substitute: false,
      }],
    }]

    await refreshTeamsheet(teams)
    const savedPlayers = await db.ManagerPlayer.findAll({ raw: true })
    const savedKeepers = await db.ManagerKeeper.findAll({ raw: true })

    expect(savedPlayers.length).toBe(4)
    expect(savedKeepers.length).toBe(2)
  })

  test('should save substitute player data', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Henderson - Rochdale',
        position: 'FWD',
        substitute: false,
      }, {
        player: 'Akinfenwa - Wycombe',
        position: 'FWD',
        substitute: true,
      }],
    }]

    await refreshTeamsheet(teams)
    const savedPlayers = await db.ManagerPlayer.findAll({ include: [{ model: db.Player }], raw: true, nest: true })

    expect(savedPlayers.length).toBe(2)
    expect(savedPlayers.filter(x => x.Player.firstName === 'Ian' && x.Player.lastName === 'Henderson' && x.substitute).length).toBe(0)
    expect(savedPlayers.filter(x => x.Player.firstName === 'Adebayo' && x.Player.lastName === 'Akinfenwa' && x.substitute).length).toBe(1)
  })

  test('should save substitute keeper data', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Rochdale',
        position: 'GK',
        substitute: false,
      }, {
        player: 'Wycombe',
        position: 'GK',
        substitute: true,
      }],
    }]

    await refreshTeamsheet(teams)
    const savedPlayers = await db.ManagerKeeper.findAll({ include: [{ model: db.Team }], raw: true, nest: true })

    expect(savedPlayers.length).toBe(2)
    expect(savedPlayers.filter(x => x.Team.name === 'Rochdale' && x.substitute).length).toBe(0)
    expect(savedPlayers.filter(x => x.Team.name === 'Wycombe' && x.substitute).length).toBe(0)
  })

  test('should save substitute player teamsheet data', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Henderson - Rochdale',
        position: 'FWD',
        substitute: false,
      }, {
        player: 'Akinfenwa - Wycombe',
        position: 'FWD',
        substitute: true,
      }],
    }]

    await refreshTeamsheet(teams)
    const savedPlayers = await db.Teamsheet.findAll({ raw: true })

    expect(savedPlayers.length).toBe(2)
    expect(savedPlayers.filter(x => x.substitute).length).toBe(1)
    expect(savedPlayers.filter(x => !x.substitute).length).toBe(1)
  })

  test('should save substitute keeper teamsheet data', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Rochdale',
        position: 'GK',
        substitute: false,
      }, {
        player: 'Wycombe',
        position: 'GK',
        substitute: true,
      }],
    }]

    await refreshTeamsheet(teams)
    const savedPlayers = await db.Teamsheet.findAll({ raw: true })

    expect(savedPlayers.length).toBe(2)
    expect(savedPlayers.filter(x => x.substitute).length).toBe(1)
    expect(savedPlayers.filter(x => !x.substitute).length).toBe(1)
  })

  test('should match team when duplicate in position', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Adams - Forest Green',
        position: 'MID',
        substitute: false,
      }],
    }]

    await refreshTeamsheet(teams)
    const savedPlayers = await db.ManagerPlayer.findAll({ include: [{ model: db.Player, include: [{ model: db.Team, as: 'team' }] }], raw: true, nest: true })
    expect(savedPlayers.filter(x => x.Player.firstName === 'Ebou' && x.Player.lastName === 'Adams' && x.Player.team.name === 'Forest Green Rovers').length).toBe(1)
    expect(savedPlayers.filter(x => x.Player.firstName === 'Joe' && x.Player.lastName === 'Adams' && x.Player.team.name === 'Bury').length).toBe(0)
  })

  test('should not insert duplicates', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Adams - Forest Green',
        position: 'MID',
        substitute: false,
      }, {
        player: 'Adams - Forest Green',
        position: 'MID',
        substitute: false,
      }],
    }]

    await refreshTeamsheet(teams)
    const savedPlayers = await db.ManagerPlayer.findAll({ include: [{ model: db.Player, include: [{ model: db.Team, as: 'team' }] }], raw: true, nest: true })

    expect(savedPlayers.filter(x => x.Player.firstName === 'Ebou' && x.Player.lastName === 'Adams' && x.Player.team.name === 'Forest Green Rovers').length).toBe(1)
  })

  test('should match Daniel Ayala', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Ayala - Middlesbrough',
        position: 'DEF',
        substitute: false,
      }],
    }]

    await refreshTeamsheet(teams)
    const savedPlayers = await db.ManagerPlayer.findAll({ include: [{ model: db.Player, include: [{ model: db.Team, as: 'team' }] }], raw: true, nest: true })

    expect(savedPlayers.filter(x => x.Player.firstName === 'Daniel' && x.Player.lastName === 'Sanchez Ayala' && x.Player.team.name === 'Middlesbrough').length).toBe(1)
  })

  test('should match Sarpeng-Wiredu', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Sarpeng-Wiredu - Charlton',
        position: 'MID',
        substitute: false,
      }],
    }]

    await refreshTeamsheet(teams)
    const savedPlayers = await db.ManagerPlayer.findAll({ include: [{ model: db.Player, include: [{ model: db.Team, as: 'team' }] }], raw: true, nest: true })

    expect(savedPlayers.filter(x => x.Player.firstName === 'Brendan' && x.Player.lastName === 'Sarpeng-Wiredu' && x.Player.team.name === 'Charlton Athletic').length).toBe(1)
  })

  test('should match Segbe Azankpo as duplicate on player list', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Segbe Azankpo - Oldham',
        position: 'FWD',
        substitute: false,
      }],
    }]

    await refreshTeamsheet(teams)
    const savedPlayers = await db.ManagerPlayer.findAll({ include: [{ model: db.Player, include: [{ model: db.Team, as: 'team' }] }], raw: true, nest: true })
    expect(savedPlayers.filter(x => x.Player.firstName === 'Desire' && x.Player.lastName === 'Segbe Azankpo' && x.Player.team.name === 'Oldham Athletic').length).toBe(1)
  })

  test('should match Segbe Azankpo as partial name', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Azankpo - Oldham',
        position: 'FWD',
        substitute: false,
      }],
    }]

    await refreshTeamsheet(teams)
    const savedPlayers = await db.ManagerPlayer.findAll({ include: [{ model: db.Player, include: [{ model: db.Team, as: 'team' }] }], raw: true, nest: true })
    expect(savedPlayers.filter(x => x.Player.firstName === 'Desire' && x.Player.lastName === 'Segbe Azankpo' && x.Player.team.name === 'Oldham Athletic').length).toBe(1)
  })

  test('should match Segbe Azankpo as second partial name', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Segbe - Oldham',
        position: 'FWD',
        substitute: false,
      }],
    }]

    await refreshTeamsheet(teams)
    const savedPlayers = await db.ManagerPlayer.findAll({ include: [{ model: db.Player, include: [{ model: db.Team, as: 'team' }] }], raw: true, nest: true })
    expect(savedPlayers.filter(x => x.Player.firstName === 'Desire' && x.Player.lastName === 'Segbe Azankpo' && x.Player.team.name === 'Oldham Athletic').length).toBe(1)
  })

  test('should match West Bromich Albion alias', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Phillips - West Brom',
        position: 'MID',
        substitute: false,
      }],
    }]

    await refreshTeamsheet(teams)
    const savedPlayers = await db.ManagerPlayer.findAll({ include: [{ model: db.Player, include: [{ model: db.Team, as: 'team' }] }], raw: true, nest: true })
    expect(savedPlayers.filter(x => x.Player.firstName === 'Matt' && x.Player.lastName === 'Phillips' && x.Player.team.name === 'West Bromich Albion').length).toBe(1)
  })
})
