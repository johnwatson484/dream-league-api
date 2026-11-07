import db from '../../src/data/index.ts'
import { getSummary } from '../../src/results/get-summary.ts'
import { getHtmlStringFromFile } from '../../src/notifications/get-html-string.ts'
import testData from '../data/index.ts'

describe('get summary', () => {
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

  test('should return summary for selected gameweek', async () => {
    await db.Summary.bulkCreate(testData.summaries)
    const result = await getSummary(2)
    expect(result.gameweekId).toBe(2)
  })

  test('should return latest if no selected gameweek', async () => {
    await db.Summary.bulkCreate(testData.summaries)
    const result = await getSummary()
    expect(result.gameweekId).toBe(2)
  })

  test.each([{ groups: undefined }, { groups: [] }])('sorts existing scores for the API and email with groups $groups', async ({ groups }) => {
    const scores = [
      { managerId: 3, manager: 'Charlie', goals: 4, conceded: 0, result: 'W', scorers: [{ name: 'Smith', goals: 4 }] },
      { managerId: 2, manager: 'Bob', goals: 2, conceded: 1, result: 'W', scorers: [] },
      { managerId: 1, manager: 'alice', goals: 0, conceded: 3, result: 'L', scorers: [] },
    ]
    const table = [{ managerId: 3, manager: 'Charlie', position: 1 }, { managerId: 2, manager: 'Bob', position: 2 }]
    const summary = { gameweekId: 1, scores, table, winners: [], cupScores: [], groups }
    await db.Summary.create({ gameweekId: 1, summary })

    for (const result of [await getSummary(1), await getSummary()]) {
      expect(result.scores).toEqual([scores[2], scores[1], scores[0]])
      expect(result.table).toEqual(table)
      const html = getHtmlStringFromFile('results.html', result)
      const scoreSection = html.split('<!-- ===== SCORES SECTION ===== -->')[1]!.split('<!-- ===== TABLE SECTION ===== -->')[0]!
      const names = [...scoreSection.matchAll(/<strong[^>]*>(.*?)<\/strong>/g)].map(match => match[1])
      expect(names).toEqual(['alice', 'Bob', 'Charlie'])
      expect(scoreSection).toContain('Smith (4)')
    }

    const saved: any = await db.Summary.findByPk(1)
    expect(saved.summary.scores).toEqual(scores)
  })

  test('should return empty object if selected gameweek does not exist', async () => {
    await db.Summary.bulkCreate(testData.summaries)
    const result = await getSummary(3)
    expect(result).toBeUndefined()
  })

  test('should return empty object if no gameweeks when selected', async () => {
    const result = await getSummary(3)
    expect(result).toBeUndefined()
  })

  test('should return empty object if no gameweeks when none selected', async () => {
    const result = await getSummary()
    expect(result).toBeUndefined()
  })
})
