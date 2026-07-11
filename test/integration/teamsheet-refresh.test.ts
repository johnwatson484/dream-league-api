import db from '../../src/data/index.ts'
import { previewMatches } from '../../src/refresh/teamsheet/preview-matches.ts'
import testData from '../data/index.ts'

describe('preview teamsheet matches', () => {
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

  afterAll(async () => {
    await db.Teamsheet.destroy({ truncate: true })
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Player.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.sequelize.close()
  })

  test('should return summary counts', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Henderson - Rochdale',
        position: 'FWD',
        substitute: false,
      }],
    }]

    const result = await previewMatches(teams)

    expect(result.summary.total).toBe(1)
    expect(result.teams.length).toBe(1)
  })

  test('should match player with correct team as confident', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Henderson - Rochdale',
        position: 'FWD',
        substitute: false,
      }],
    }]

    const result = await previewMatches(teams)
    const match = result.teams[0]!.matches[0]!

    expect(match.category).toBe('confident')
    expect(match.bestMatch).not.toBeNull()
  })

  test('should match keeper by team name', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Rochdale',
        position: 'GK',
        substitute: false,
      }],
    }]

    const result = await previewMatches(teams)
    const match = result.teams[0]!.matches[0]!

    expect(match.category).toBe('confident')
    expect(match.bestMatch).not.toBeNull()
  })

  test('should skip invalid manager', async () => {
    const teams = [{
      manager: 'NonexistentManager',
      players: [{
        player: 'Henderson - Rochdale',
        position: 'FWD',
        substitute: false,
      }],
    }]

    const result = await previewMatches(teams)

    expect(result.teams.length).toBe(0)
    expect(result.summary.total).toBe(0)
  })

  test('should handle multiple players and managers', async () => {
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
      }],
    }]

    const result = await previewMatches(teams)

    expect(result.summary.total).toBe(4)
    expect(result.teams.length).toBe(2)
  })

  test('should preserve substitute flag', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Henderson - Rochdale',
        position: 'FWD',
        substitute: true,
      }],
    }]

    const result = await previewMatches(teams)
    const match = result.teams[0]!.matches[0]!

    expect(match.substitute).toBe(true)
  })

  test('should match Adams to correct team when duplicates exist', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Adams - Forest Green',
        position: 'MID',
        substitute: false,
      }],
    }]

    const result = await previewMatches(teams)
    const match = result.teams[0]!.matches[0]!

    expect(match.category).toBe('confident')
  })

  test('should return unrecognized for completely unknown player', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Xyzzynospam - Nowhere',
        position: 'FWD',
        substitute: false,
      }],
    }]

    const result = await previewMatches(teams)
    const match = result.teams[0]!.matches[0]!

    expect(match.category).toBe('unrecognized')
  })

  test('should parse source text into name and team', async () => {
    const teams = [{
      manager: 'John',
      players: [{
        player: 'Henderson - Rochdale',
        position: 'FWD',
        substitute: false,
      }],
    }]

    const result = await previewMatches(teams)
    const match = result.teams[0]!.matches[0]!

    expect(match.parsedName).toBe('Henderson')
    expect(match.parsedTeam).toBe('Rochdale')
  })
})
