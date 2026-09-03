import db from '../../src/data/index.ts'
import { getInput } from '../../src/results/get-input.ts'
import testData from '../data/index.ts'

describe('get results input', () => {
  beforeAll(async () => {
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.Player.destroy({ truncate: true })
    await db.Gameweek.destroy({ truncate: true })
    await db.Manager.bulkCreate(testData.managers)
    await db.Team.bulkCreate(testData.teams)
    await db.Player.bulkCreate(testData.players)
    await db.ManagerKeeper.bulkCreate(testData.managerKeepers)
    await db.ManagerPlayer.bulkCreate(testData.managerPlayers)
    await db.Gameweek.bulkCreate([
      { gameweekId: 1, startDate: '2020-09-11' },
      { gameweekId: 2, startDate: '2026-09-01' },
      { gameweekId: 3, startDate: '2026-09-15' },
    ])
  })

  afterAll(async () => {
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Player.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.Gameweek.destroy({ truncate: true })
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

  test('should mark exactly one gameweek as the current gameweek by calendar date', async () => {
    vi.setSystemTime(new Date('2026-09-03T12:00:00.000Z'))

    const result = await getInput()
    const current = result.gameweeks.filter((gw: any) => gw.isCurrent)

    expect(current.map((gw: any) => gw.gameweekId)).toEqual([2])

    vi.useRealTimers()
  })

  test('should treat every gameweek that has started as active, even if it is not the current one', async () => {
    vi.setSystemTime(new Date('2026-09-03T12:00:00.000Z'))

    const result = await getInput()
    const active = result.gameweeks.filter((gw: any) => gw.isActive)

    expect(active.map((gw: any) => gw.gameweekId).toSorted()).toEqual([1, 2])

    vi.useRealTimers()
  })
})
