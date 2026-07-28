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

  test('returns winners with gameweek, name, managerId, and goals', async () => {
    await db.Summary.bulkCreate(testData.summaries)

    const result = await getAllWinners()

    expect(result).toContainEqual({ gameweek: 1, name: 'Alice', managerId: 1, goals: 7 })
  })

  test('returns multiple winners for a single gameweek', async () => {
    await db.Summary.bulkCreate(testData.summaries)

    const result = await getAllWinners()
    const gameweek2Winners = result.filter(w => w.gameweek === 2)

    expect(gameweek2Winners).toHaveLength(2)
    expect(gameweek2Winners).toContainEqual({ gameweek: 2, name: 'Bob', managerId: 2, goals: 11 })
    expect(gameweek2Winners).toContainEqual({ gameweek: 2, name: 'Charlie', managerId: 3, goals: 11 })
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
