import db from '../../src/data/index.ts'
import { generateFixtures } from '../../src/fixtures/generate.ts'
import { getGroupStandings } from '../../src/cups/get-group-standings.ts'
import { getGroups } from '../../src/results/get-groups.ts'
import { update } from '../../src/results/update.ts'

describe('group standings', () => {
  beforeAll(async () => {
    await db.Fixture.destroy({ truncate: true })
    await db.ManagerGroup.destroy({ truncate: true })
    await db.Group.destroy({ truncate: true })
    await db.Cup.destroy({ truncate: true, cascade: true })
    await db.Manager.destroy({ truncate: true })
    await db.Gameweek.destroy({ truncate: true })
    await db.Manager.bulkCreate([1, 2, 3, 4].map(managerId => ({ managerId, name: `Manager ${managerId}` })))
    await db.Gameweek.bulkCreate([1, 2, 3].map(gameweekId => ({ gameweekId, startDate: new Date('2030-01-01') })))
    await db.Cup.bulkCreate([{ cupId: 1, name: 'Cup', hasGroupStage: true }, { cupId: 2, name: 'Other Cup' }])
    await db.Group.create({ groupId: 1, cupId: 1, name: 'Group A', groupLegs: 1, teamsAdvancing: 2 })
    await db.ManagerGroup.bulkCreate([1, 2, 3, 4].map(managerId => ({ groupId: 1, managerId })))
  })

  beforeEach(async () => {
    await db.Fixture.destroy({ truncate: true })
    await db.Summary.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
    await db.Concede.destroy({ truncate: true })
    await generateFixtures(1, [1, 2, 3])
  })

  afterAll(async () => {
    for (const model of [db.Fixture, db.ManagerGroup, db.Group, db.Cup, db.Summary, db.Goal, db.Concede, db.Manager, db.Gameweek]) {
      await model.destroy({ truncate: true })
    }
    await db.sequelize.close()
  })

  test('generated fixtures without submitted results leave every team on zero', async () => {
    const [group] = await getGroupStandings(1)
    expect(group!.table).toHaveLength(4)
    for (const row of group!.table) {
      expect(row).toMatchObject({ played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 })
    }
  })

  test('submitted goalless results count as draws in the saved summary and live standings', async () => {
    await update({ gameweekId: 1, goals: [], conceded: [] })
    const [group] = await getGroupStandings(1)
    const summary: any = await db.Summary.findByPk(1)
    for (const table of [group!.table, summary.summary.groups[0]]) {
      expect(table).toHaveLength(4)
      for (const row of table) {
        expect(row).toMatchObject({ played: 1, drawn: 1, won: 0, lost: 0, points: 1 })
      }
    }
  })

  test('skipped weeks do not count, even when a later week has results', async () => {
    await update({ gameweekId: 3, goals: [], conceded: [] })
    const [group] = await getGroupStandings(1)
    const summary: any = await db.Summary.findByPk(3)
    for (const table of [group!.table, summary.summary.groups[0]]) {
      expect(table.every((row: any) => row.played === 1 && row.drawn === 1)).toBe(true)
    }
  })

  test('other cups and knockout fixtures on the same week do not affect group standings', async () => {
    await db.Fixture.bulkCreate([
      { cupId: 2, gameweekId: 1, round: 1, homeManagerId: 1, awayManagerId: 2 },
      { cupId: 1, gameweekId: 1, round: 2, homeManagerId: 1, awayManagerId: 2 },
    ])
    await update({ gameweekId: 1, goals: [], conceded: [] })
    const [group] = await getGroupStandings(1)
    const [historicalTable] = await getGroups(1)
    for (const table of [group!.table, historicalTable]) {
      expect(table.every((row: any) => row.played === 1 && row.points === 1)).toBe(true)
    }
  })

  test('historical tables exclude results submitted for later weeks', async () => {
    await update({ gameweekId: 1, goals: [], conceded: [] })
    await update({ gameweekId: 3, goals: [], conceded: [] })
    const [table] = await getGroups(1)
    expect(table.every((row: any) => row.played === 1)).toBe(true)
    const [group] = await getGroupStandings(1)
    expect(group!.table.every(row => row.played === 2)).toBe(true)
  })
})
