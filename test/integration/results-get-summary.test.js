const db = require('../../app/data')
const getSummary = require('../../app/results/get-summary')
const testData = require('../data')

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
