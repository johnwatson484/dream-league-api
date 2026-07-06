import db from '../../src/data/index.ts'
import { update } from '../../src/results/update.ts'
import { getExisting } from '../../src/results/get-existing.ts'
import testData from '../data/index.ts'

describe('get existing results', () => {
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

  test('should return empty arrays when no results exist', async () => {
    const existing = await getExisting(1)
    expect(existing.goals).toEqual([])
    expect(existing.goalsCup).toEqual([])
    expect(existing.conceded).toEqual([])
    expect(existing.concededCup).toEqual([])
  })

  test('should return aggregated goals per player', async () => {
    await update({
      gameweekId: 1,
      goals: [{ playerId: 773, goals: 2 }, { playerId: 291, goals: 1 }],
      conceded: [],
    })

    const existing = await getExisting(1)
    expect(existing.goals).toContainEqual({ playerId: 773, goals: 2 })
    expect(existing.goals).toContainEqual({ playerId: 291, goals: 1 })
  })

  test('should return aggregated conceded per team', async () => {
    await update({
      gameweekId: 1,
      goals: [],
      conceded: [{ teamId: 60, conceded: 3 }, { teamId: 28, conceded: 1 }],
    })

    const existing = await getExisting(1)
    expect(existing.conceded).toContainEqual({ teamId: 60, conceded: 3 })
    expect(existing.conceded).toContainEqual({ teamId: 28, conceded: 1 })
  })

  test('should separate league and cup results', async () => {
    await update({
      gameweekId: 1,
      goals: [{ playerId: 773, goals: 1 }],
      goalsCup: [{ playerId: 773, goals: 2 }],
      conceded: [{ teamId: 60, conceded: 1 }],
      concededCup: [{ teamId: 60, conceded: 3 }],
    })

    const existing = await getExisting(1)
    expect(existing.goals).toContainEqual({ playerId: 773, goals: 1 })
    expect(existing.goalsCup).toContainEqual({ playerId: 773, goals: 2 })
    expect(existing.conceded).toContainEqual({ teamId: 60, conceded: 1 })
    expect(existing.concededCup).toContainEqual({ teamId: 60, conceded: 3 })
  })
})
