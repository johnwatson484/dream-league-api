import db from '../../src/data/index.ts'
import { confirmTeamsheet } from '../../src/refresh/teamsheet/confirm-teamsheet.ts'
import testData from '../data/index.ts'

describe('confirm teamsheet', () => {
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

  beforeEach(async () => {
    await db.Teamsheet.destroy({ truncate: true })
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
  })

  test('should save player assignments', async () => {
    const result = await confirmTeamsheet({
      assignments: [
        { managerId: 1, playerId: 773, substitute: false },
        { managerId: 1, playerId: 291, substitute: true },
      ],
      keeperAssignments: [],
      teamsheetRecords: [
        { managerId: 1, player: 'Henderson - Rochdale', position: 'Forward', substitute: false, bestMatchId: 773, distance: 0, confidence: 0.95, category: 'confident', parsedName: 'Henderson', parsedTeam: 'Rochdale' },
        { managerId: 1, player: 'Akinfenwa - Wycombe', position: 'Forward', substitute: true, bestMatchId: 291, distance: 0, confidence: 0.92, category: 'confident', parsedName: 'Akinfenwa', parsedTeam: 'Wycombe' },
      ],
    })

    expect(result.success).toBe(true)

    const players = await db.ManagerPlayer.findAll({ where: { managerId: 1 }, raw: true })
    expect(players.length).toBe(2)
    expect(players.some((p: any) => p.playerId === 773 && !p.substitute)).toBe(true)
    expect(players.some((p: any) => p.playerId === 291 && p.substitute)).toBe(true)
  })

  test('should save keeper assignments', async () => {
    await confirmTeamsheet({
      assignments: [],
      keeperAssignments: [
        { managerId: 1, teamId: 60, substitute: false },
        { managerId: 1, teamId: 28, substitute: true },
      ],
      teamsheetRecords: [
        { managerId: 1, player: 'Rochdale', position: 'Goalkeeper', substitute: false, bestMatchId: 60, distance: 0, confidence: 0.9, category: 'confident', parsedName: 'Rochdale', parsedTeam: '' },
        { managerId: 1, player: 'Wycombe', position: 'Goalkeeper', substitute: true, bestMatchId: 28, distance: 0, confidence: 0.9, category: 'confident', parsedName: 'Wycombe', parsedTeam: '' },
      ],
    })

    const keepers = await db.ManagerKeeper.findAll({ where: { managerId: 1 }, raw: true })
    expect(keepers.length).toBe(2)
    expect(keepers.some((k: any) => k.teamId === 60 && !k.substitute)).toBe(true)
    expect(keepers.some((k: any) => k.teamId === 28 && k.substitute)).toBe(true)
  })

  test('should replace existing squad for manager', async () => {
    await db.ManagerPlayer.create({ managerId: 1, playerId: 100, substitute: false })
    await db.ManagerKeeper.create({ managerId: 1, teamId: 99, substitute: false })

    await confirmTeamsheet({
      assignments: [{ managerId: 1, playerId: 773, substitute: false }],
      keeperAssignments: [{ managerId: 1, teamId: 60, substitute: false }],
      teamsheetRecords: [
        { managerId: 1, player: 'Henderson - Rochdale', position: 'Forward', substitute: false, bestMatchId: 773, distance: 0, confidence: 0.95, category: 'confident', parsedName: 'Henderson', parsedTeam: 'Rochdale' },
        { managerId: 1, player: 'Rochdale', position: 'Goalkeeper', substitute: false, bestMatchId: 60, distance: 0, confidence: 0.9, category: 'confident', parsedName: 'Rochdale', parsedTeam: '' },
      ],
    })

    const players = await db.ManagerPlayer.findAll({ where: { managerId: 1 }, raw: true })
    const keepers = await db.ManagerKeeper.findAll({ where: { managerId: 1 }, raw: true })
    expect(players.length).toBe(1)
    expect((players[0] as any).playerId).toBe(773)
    expect(keepers.length).toBe(1)
    expect((keepers[0] as any).teamId).toBe(60)
  })

  test('should not affect other managers', async () => {
    await db.ManagerPlayer.create({ managerId: 2, playerId: 100, substitute: false })

    await confirmTeamsheet({
      assignments: [{ managerId: 1, playerId: 773, substitute: false }],
      keeperAssignments: [],
      teamsheetRecords: [
        { managerId: 1, player: 'Henderson - Rochdale', position: 'Forward', substitute: false, bestMatchId: 773, distance: 0, confidence: 0.95, category: 'confident', parsedName: 'Henderson', parsedTeam: 'Rochdale' },
      ],
    })

    const manager2Players = await db.ManagerPlayer.findAll({ where: { managerId: 2 }, raw: true })
    expect(manager2Players.length).toBe(1)
  })

  test('should save teamsheet records', async () => {
    await confirmTeamsheet({
      assignments: [{ managerId: 1, playerId: 773, substitute: false }],
      keeperAssignments: [],
      teamsheetRecords: [
        { managerId: 1, player: 'Henderson - Rochdale', position: 'Forward', substitute: false, bestMatchId: 773, distance: 0, confidence: 0.95, category: 'confident', parsedName: 'Henderson', parsedTeam: 'Rochdale' },
      ],
    })

    const records = await db.Teamsheet.findAll({ where: { managerId: 1 }, raw: true })
    expect(records.length).toBe(1)
    expect((records[0] as any).confidence).toBeCloseTo(0.95)
    expect((records[0] as any).category).toBe('confident')
  })

  test('should return success without changes when no assignments', async () => {
    const result = await confirmTeamsheet({
      assignments: [],
      keeperAssignments: [],
      teamsheetRecords: [],
    })

    expect(result.success).toBe(true)
  })
})
