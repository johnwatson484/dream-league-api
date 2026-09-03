import { Sequelize, DataTypes } from 'sequelize'
import defineGameweekModel from '../../src/data/models/gameweek.ts'

const sequelize = new Sequelize('test', 'test', 'test', { dialect: 'postgres', logging: false })
const Gameweek = defineGameweekModel(sequelize, DataTypes as any)

function buildGameweek (startDate: string): any {
  return Gameweek.build({ gameweekId: 1, startDate })
}

describe('gameweek model', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  test('isActive is true once the gameweek has started, no matter how long ago', () => {
    vi.setSystemTime(new Date('2026-09-03T12:00:00.000Z'))
    expect(buildGameweek('2020-01-01').isActive).toBe(true)
  })

  test('isActive is false before the gameweek has started', () => {
    vi.setSystemTime(new Date('2026-09-03T12:00:00.000Z'))
    expect(buildGameweek('2030-01-01').isActive).toBe(false)
  })

  test('isCurrent is false before the gameweek window starts', () => {
    vi.setSystemTime(new Date('2026-09-01T00:00:00.000Z'))
    expect(buildGameweek('2026-09-03').isCurrent).toBe(false)
  })

  test('isCurrent is true within the 7-day window', () => {
    vi.setSystemTime(new Date('2026-09-06T12:00:00.000Z'))
    expect(buildGameweek('2026-09-03').isCurrent).toBe(true)
  })

  test('isCurrent is true exactly on the start date', () => {
    vi.setSystemTime(new Date('2026-09-03T00:00:00.000Z'))
    expect(buildGameweek('2026-09-03').isCurrent).toBe(true)
  })

  test('isCurrent is true exactly on the end date', () => {
    vi.setSystemTime(new Date('2026-09-09T00:00:00.000Z'))
    expect(buildGameweek('2026-09-03').isCurrent).toBe(true)
  })

  test('isCurrent is false after the gameweek window ends', () => {
    vi.setSystemTime(new Date('2026-09-11T00:00:00.000Z'))
    expect(buildGameweek('2026-09-03').isCurrent).toBe(false)
  })

  test('isCurrent is false for a gameweek that has not started, even though isActive is also false', () => {
    vi.setSystemTime(new Date('2026-09-01T00:00:00.000Z'))
    const gameweek = buildGameweek('2026-09-03')
    expect(gameweek.isActive).toBe(false)
    expect(gameweek.isCurrent).toBe(false)
  })
})
