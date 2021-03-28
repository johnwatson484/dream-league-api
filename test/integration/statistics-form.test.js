const db = require('../../app/data/models')
const { getForm } = require('../../app/dream-league/statistics')
const testData = require('../data')

describe('get form', () => {
  beforeAll(async () => {
    await db.Summary.destroy({ truncate: true })
    await db.Gameweek.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Gameweek.bulkCreate(testData.gameweeks)
    await db.Summary.bulkCreate(testData.summaries)
    await db.Manager.bulkCreate(testData.managers)
  })

  afterAll(async () => {
    await db.Summary.destroy({ truncate: true })
    await db.Gameweek.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.sequelize.close()
  })

  test('should return all managers', async () => {
    const result = await getForm()
    expect(result.length).toBe(13)
  })
})
