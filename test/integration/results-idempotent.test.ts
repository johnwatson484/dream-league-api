import db from '../../src/data/index.ts'
import { update } from '../../src/results/update.ts'
import testData from '../data/index.ts'

describe('idempotent results update', () => {
  beforeAll(async () => {
    await db.Summary.destroy({ truncate: true })
    await db.Concede.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.Player.destroy({ truncate: true })
    await db.Manager.bulkCreate(testData.managers)
    await db.Team.bulkCreate(testData.teams)
    await db.Player.bulkCreate(testData.players)
    await db.ManagerKeeper.bulkCreate(testData.managerKeepers)
    await db.ManagerPlayer.bulkCreate(testData.managerPlayers)
  })

  afterAll(async () => {
    await db.Summary.destroy({ truncate: true })
    await db.Concede.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Player.destroy({ truncate: true })
    await db.Team.destroy({ truncate: true })
    await db.sequelize.close()
  })

  beforeEach(async () => {
    await db.Summary.destroy({ truncate: true })
    await db.Concede.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
  })

  const results = {
    gameweekId: 1,
    conceded: [{ teamId: 60, conceded: 2 }, { teamId: 28, conceded: 1 }],
    goals: [{ playerId: 773, goals: 1 }, { playerId: 291, goals: 3 }],
  }

  test('should replace existing results when submitted again', async () => {
    await update(results)
    const goalsAfterFirst = await db.Goal.count({ where: { gameweekId: 1 } })
    expect(goalsAfterFirst).toBe(4)

    await update(results)
    const goalsAfterSecond = await db.Goal.count({ where: { gameweekId: 1 } })
    expect(goalsAfterSecond).toBe(4)
  })

  test('should replace with different values on resubmit', async () => {
    await update(results)

    const updatedResults = {
      gameweekId: 1,
      conceded: [{ teamId: 60, conceded: 3 }],
      goals: [{ playerId: 773, goals: 2 }],
    }
    await update(updatedResults)

    const goals = await db.Goal.count({ where: { gameweekId: 1 } })
    const conceded = await db.Concede.count({ where: { gameweekId: 1 } })
    expect(goals).toBe(2)
    expect(conceded).toBe(3)
  })

  test('should not affect other gameweeks', async () => {
    const gw2Results = { gameweekId: 2, goals: [{ playerId: 773, goals: 1 }], conceded: [] }
    await update(gw2Results)
    await update(results)

    const gw2Goals = await db.Goal.count({ where: { gameweekId: 2 } })
    expect(gw2Goals).toBe(1)
  })
})
