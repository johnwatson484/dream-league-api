import db from '../../src/data/index.ts'
import { generateFixtures, calculateRequiredWeeks } from '../../src/fixtures/generate.ts'
import testData from '../data/index.ts'

describe('fixture generation', () => {
  beforeAll(async () => {
    await db.Fixture.destroy({ truncate: true })
    await db.Group.destroy({ truncate: true, cascade: true })
    await db.Cup.destroy({ truncate: true, cascade: true })
    await db.Manager.destroy({ truncate: true })
    await db.Gameweek.destroy({ truncate: true })
    await db.Manager.bulkCreate(testData.managers)
    await db.Gameweek.bulkCreate(testData.gameweeks)
    await db.Cup.create({ cupId: 1, name: 'Cup', hasGroupStage: true, knockoutLegs: 2 } as any)
  })

  afterAll(async () => {
    await db.Fixture.destroy({ truncate: true })
    await db.Group.destroy({ truncate: true, cascade: true })
    await db.Cup.destroy({ truncate: true, cascade: true })
    await db.Manager.destroy({ truncate: true })
    await db.Gameweek.destroy({ truncate: true })
    await db.sequelize.close()
  })

  beforeEach(async () => {
    await db.Fixture.destroy({ truncate: true })
    await db.Group.destroy({ truncate: true, cascade: true })
  })

  async function createGroup (name: string, managerIds: number[], groupLegs = 1): Promise<void> {
    const group = await db.Group.create({ cupId: 1, name, groupLegs, teamsAdvancing: 2 } as any)
    for (const managerId of managerIds) {
      await (db as any).ManagerGroup.create({ groupId: (group as any).groupId, managerId })
    }
  }

  test('should generate single round-robin for 4 managers', async () => {
    await createGroup('Group A', [1, 2, 3, 4])
    const fixtures = await generateFixtures(1, [1, 2, 3, 4, 5, 6])
    expect(fixtures.length).toBe(6)
  })

  test('should generate double round-robin with groupLegs 2', async () => {
    await createGroup('Group A', [1, 2, 3, 4], 2)
    const fixtures = await generateFixtures(1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(fixtures.length).toBe(12)
  })

  test('should swap home/away on second leg', async () => {
    await createGroup('Group A', [1, 2], 2)
    const fixtures = await generateFixtures(1, [1, 2])
    expect(fixtures.length).toBe(2)
    const [first, second] = fixtures
    expect(first!.homeManagerId).toBe(second!.awayManagerId)
    expect(first!.awayManagerId).toBe(second!.homeManagerId)
  })

  test('should handle odd number of managers with bye', async () => {
    await createGroup('Group A', [1, 2, 3])
    const fixtures = await generateFixtures(1, [1, 2, 3, 4, 5])
    expect(fixtures.length).toBe(3)
  })

  test('should throw error when not enough gameweeks', async () => {
    await createGroup('Group A', [1, 2, 3, 4])
    await expect(generateFixtures(1, [1, 2])).rejects.toThrow('Not enough gameweeks')
  })

  test('should assign all fixtures round 1', async () => {
    await createGroup('Group A', [1, 2, 3])
    const fixtures = await generateFixtures(1, [1, 2, 3, 4, 5])
    expect(fixtures.every(f => f.round === 1)).toBe(true)
  })

  describe('calculateRequiredWeeks', () => {
    test('should calculate for single leg', () => {
      const result = calculateRequiredWeeks([{ managerIds: [1, 2, 3, 4], groupLegs: 1 }])
      expect(result).toBe(3)
    })

    test('should calculate for double leg', () => {
      const result = calculateRequiredWeeks([{ managerIds: [1, 2, 3, 4], groupLegs: 2 }])
      expect(result).toBe(6)
    })

    test('should return max across multiple groups', () => {
      const result = calculateRequiredWeeks([
        { managerIds: [1, 2, 3, 4], groupLegs: 1 },
        { managerIds: [5, 6, 7], groupLegs: 2 },
      ])
      expect(result).toBe(6)
    })
  })
})
