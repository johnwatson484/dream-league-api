import db from '../../src/data/index.ts'
import testData from '../data/index.ts'

describe('player transfer', () => {
  beforeAll(async () => {
    await db.Player.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.Team.bulkCreate(testData.teams)
    await db.Player.bulkCreate(testData.players)
  })

  afterAll(async () => {
    await db.Player.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.sequelize.close()
  })

  test('should update player team', async () => {
    const originalPlayer: any = await db.Player.findOne({ where: { playerId: 773 }, raw: true })
    const originalTeamId = originalPlayer.teamId

    await db.Player.update({ teamId: 28 }, { where: { playerId: 773 } })

    const updatedPlayer: any = await db.Player.findOne({ where: { playerId: 773 }, raw: true })
    expect(updatedPlayer.teamId).toBe(28)

    await db.Player.update({ teamId: originalTeamId }, { where: { playerId: 773 } })
  })

  test('should not throw for non-existent player', async () => {
    const [affectedRows] = await db.Player.update({ teamId: 28 }, { where: { playerId: 99999 } })
    expect(affectedRows).toBe(0)
  })
})
