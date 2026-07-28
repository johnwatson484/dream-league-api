import db from '../../src/data/index.ts'
import { getAllWinners } from '../../src/results/get-all-winners.ts'
import testData from '../data/index.ts'

describe('get all winners', () => {
  beforeAll(async () => {
    await db.Summary.destroy({ truncate: true })
    await db.Gameweek.destroy({ truncate: true })
    await db.Gameweek.bulkCreate(testData.gameweeks)
  })

  afterAll(async () => {
    await db.Summary.destroy({ truncate: true })
    await db.Gameweek.destroy({ truncate: true })
    await db.sequelize.close()
  })

  beforeEach(async () => {
    await db.Summary.destroy({ truncate: true })
  })

  afterEach(async () => {
    await db.Summary.destroy({ truncate: true })
  })

  test('returns winners with full score data', async () => {
    await db.Summary.bulkCreate(testData.summaries)

    const result = await getAllWinners()
    const alice = result.find(w => w.name === 'Alice')

    expect(alice).toEqual({
      gameweek: 1,
      name: 'Alice',
      managerId: 1,
      goals: 7,
      conceded: 2,
      margin: 5,
      result: 'W',
      scorers: [{ playerId: 10, name: 'Smith A', goals: 4 }, { playerId: 11, name: 'Jones B', goals: 3 }],
    })
  })

  test('returns multiple winners for a single gameweek with scorers', async () => {
    await db.Summary.bulkCreate(testData.summaries)

    const result = await getAllWinners()
    const gameweek2Winners = result.filter(w => w.gameweek === 2)

    expect(gameweek2Winners).toHaveLength(2)
    expect(gameweek2Winners[0].margin).toBe(8)
    expect(gameweek2Winners[1].margin).toBe(8)
    expect(gameweek2Winners[0].scorers.length).toBeGreaterThan(0)
    expect(gameweek2Winners[1].scorers.length).toBeGreaterThan(0)
  })

  test('returns winners across multiple gameweeks', async () => {
    await db.Summary.bulkCreate(testData.summaries)

    const result = await getAllWinners()
    const gameweeks = [...new Set(result.map(w => w.gameweek))]

    expect(gameweeks).toHaveLength(2)
  })

  test('returns empty array when no summaries exist', async () => {
    const result = await getAllWinners()

    expect(result).toEqual([])
  })
})
