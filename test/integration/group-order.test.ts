import db from '../../src/data/index.ts'
import { getGroups } from '../../src/results/get-groups.ts'
import { getGroupStandings } from '../../src/cups/get-group-standings.ts'
import { getSummary } from '../../src/results/get-summary.ts'

const models = [db.Fixture, db.ManagerGroup, db.Group, db.Cup, db.Summary, db.Goal, db.Concede, db.Manager, db.Gameweek]

describe('alphabetical group ordering', () => {
  beforeAll(async () => {
    for (const model of models) {
      await model.destroy({ truncate: true })
    }
    await db.Manager.bulkCreate([1, 2, 3, 4].map(managerId => ({ managerId, name: `Manager ${managerId}` })))
    await db.Gameweek.create({ gameweekId: 1, startDate: new Date('2030-01-01') })
    await db.Cup.create({ cupId: 1, name: 'Cup', hasGroupStage: true })
    await db.Group.bulkCreate([
      { groupId: 1, cupId: 1, name: 'Group B' },
      { groupId: 2, cupId: 1, name: 'Group A' },
    ])
    await db.ManagerGroup.bulkCreate([
      { groupId: 1, managerId: 1 }, { groupId: 1, managerId: 2 },
      { groupId: 2, managerId: 3 }, { groupId: 2, managerId: 4 },
    ])
    await db.Fixture.create({ cupId: 1, gameweekId: 1, round: 1, homeManagerId: 1, awayManagerId: 2 })
  })

  afterAll(async () => {
    for (const model of models) {
      await model.destroy({ truncate: true })
    }
    await db.sequelize.close()
  })

  test('orders both new summary tables and cup standings by group name rather than ID', async () => {
    const tables = await getGroups(1)
    expect(tables.map(table => table.map((row: any) => row.managerId).sort())).toEqual([[3, 4], [1, 2]])

    const standings = await getGroupStandings(1)
    expect(standings.map(group => group.groupName)).toEqual(['Group A', 'Group B'])
  })

  test('orders existing saved results on read without rewriting them or their standings', async () => {
    const groupB = [{ managerId: 2, position: 1, points: 6 }, { managerId: 1, position: 2, points: 0 }]
    const groupA = [{ managerId: 4, position: 1, points: 3 }, { managerId: 3, position: 2, points: 0 }]
    const scores = [{ managerId: 2, manager: 'Bob' }, { managerId: 1, manager: 'Alice' }]
    await db.Summary.create({ gameweekId: 1, summary: { gameweekId: 1, scores, groups: [groupB, groupA] } })

    const summary = await getSummary(1)
    expect(summary.groups).toEqual([groupA, groupB])
    expect(summary.scores).toEqual([scores[1], scores[0]])
    const saved: any = await db.Summary.findByPk(1)
    expect(saved.summary.groups).toEqual([groupB, groupA])
    expect(saved.summary.scores).toEqual(scores)
  })
})
