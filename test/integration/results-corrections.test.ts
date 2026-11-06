import Hapi from '@hapi/hapi'
import db from '../../src/data/index.ts'
import { update } from '../../src/results/update.ts'
import { deleteResults } from '../../src/results/delete-results.ts'
import { createSummary, rebuildExistingSummaries } from '../../src/results/create-summary.ts'
import { getSummary } from '../../src/results/get-summary.ts'
import { getGroupStandings } from '../../src/cups/get-group-standings.ts'
import { acceptGoalReport } from '../../src/goal-reports/accept-goal-report.ts'
import goalRoutes from '../../src/server/routes/goals.ts'
import concededRoutes from '../../src/server/routes/conceded.ts'
import cupRoutes from '../../src/server/routes/cups.ts'

describe('result corrections remain consistent', () => {
  const server = Hapi.server()

  beforeAll(async () => {
    server.route([...goalRoutes, ...concededRoutes, ...cupRoutes].map(route => ({ ...route, options: { ...route.options, auth: false } })))
    await server.initialize()
    await db.ManagerGroup.destroy({ truncate: true })
    await db.Group.destroy({ truncate: true })
    await db.Cup.destroy({ truncate: true, cascade: true })
    await db.ManagerPlayer.destroy({ truncate: true })
    await db.ManagerKeeper.destroy({ truncate: true })
    await db.Manager.destroy({ truncate: true })
    await db.Player.destroy({ truncate: true })
    await db.Gameweek.destroy({ truncate: true })
    await db.Manager.bulkCreate([1, 2, 3, 4].map(managerId => ({ managerId, name: `Manager ${managerId}` })))
    await db.Player.bulkCreate([1, 2].map(playerId => ({ playerId, firstName: 'A', lastName: `Player ${playerId}` })))
    await db.ManagerPlayer.bulkCreate([{ managerId: 1, playerId: 1 }, { managerId: 2, playerId: 2 }])
    await db.ManagerKeeper.bulkCreate([{ managerId: 1, teamId: 1 }, { managerId: 2, teamId: 2 }])
    await db.Gameweek.bulkCreate([1, 2, 3].map(gameweekId => ({ gameweekId, startDate: new Date('2030-01-01') })))
    await db.Cup.create({ cupId: 1, name: 'Cup', hasGroupStage: true, knockoutLegs: 2 })
    await db.Group.create({ groupId: 1, cupId: 1, name: 'Group A', teamsAdvancing: 2 })
    await db.ManagerGroup.bulkCreate([1, 2, 3, 4].map(managerId => ({ groupId: 1, managerId })))
  })

  beforeEach(async () => {
    await db.Summary.destroy({ truncate: true })
    await db.Goal.destroy({ truncate: true })
    await db.Concede.destroy({ truncate: true })
    await db.GoalReport.destroy({ truncate: true })
    await db.CupResult.destroy({ truncate: true })
    await db.Fixture.destroy({ truncate: true, restartIdentity: true })
    await db.Fixture.bulkCreate([1, 2, 3].flatMap(gameweekId => [
      { gameweekId, cupId: 1, round: 1, homeManagerId: 1, awayManagerId: 2 },
      { gameweekId, cupId: 1, round: 1, homeManagerId: 3, awayManagerId: 4 },
    ]))
  })

  afterEach(() => { db.Summary.removeHook('beforeUpsert', 'fail-summary') })

  afterAll(async () => {
    await server.stop()
    for (const model of [db.CupResult, db.Fixture, db.ManagerGroup, db.Group, db.Cup, db.Summary, db.Goal, db.Concede, db.GoalReport, db.ManagerPlayer, db.ManagerKeeper, db.Manager, db.Player, db.Gameweek]) {
      await model.destroy({ truncate: true })
    }
    await db.sequelize.close()
  })

  const scores = (gameweekId: number, amount = 1) => ({
    gameweekId,
    goals: [{ playerId: 1, goals: amount }],
    conceded: [{ teamId: 2, conceded: 1 }],
    goalsCup: [{ playerId: 1, goals: amount }],
    concededCup: [{ teamId: 2, conceded: 1 }],
  })

  async function assertLiveMatchesSaved (gameweekId: number) {
    const [live] = await getGroupStandings(1)
    const saved = await getSummary(gameweekId)
    expect(saved.groups[0]).toEqual(live!.table)
  }

  async function report (goalsCup = 1) {
    return db.GoalReport.create({ playerId: 1, managerId: 1, gameweekId: 1, goals: 1, goalsCup, status: 'pending', submittedBy: 1, created: new Date() }) as any
  }

  function failLaterSummary () {
    db.Summary.addHook('beforeUpsert', 'fail-summary', (values: any) => {
      if (values.gameweekId === 3) { throw new Error('Summary write failed') }
    })
  }

  test('a submitted league-only week counts its cup fixtures as goalless draws', async () => {
    await update({ gameweekId: 1, goals: [{ playerId: 1, goals: 2 }] })
    const saved = await getSummary(1)
    expect(saved.groups[0].every((row: any) => row.played === 1 && row.drawn === 1 && row.points === 1)).toBe(true)
    await assertLiveMatchesSaved(1)
  })

  test('a league-only goal report retains the single-week completion rule', async () => {
    const entry = await report(0)
    await acceptGoalReport(entry.goalReportId, 99)
    const saved = await getSummary(1)
    expect(saved.groups[0].every((row: any) => row.played === 1 && row.drawn === 1)).toBe(true)
    await assertLiveMatchesSaved(1)
  })

  test('correcting an earlier week rebuilds later league and cup tables without duplicating scores', async () => {
    await update(scores(1))
    await update(scores(3))
    const originalWeek3Scores = (await getSummary(3)).scores
    await update(scores(1, 3))
    await update(scores(1, 3))
    const later = await getSummary(3)
    expect(later.scores).toEqual(originalWeek3Scores)
    expect(later.table.find((row: any) => row.managerId === 1)).toMatchObject({ played: 2, gf: 4, won: 2, points: 6 })
    expect(later.groups[0].find((row: any) => row.managerId === 1)).toMatchObject({ played: 2, gf: 4, won: 2, points: 6 })
    expect(await db.Goal.count({ where: { gameweekId: 1 } })).toBe(6)
    await assertLiveMatchesSaved(3)
  })

  test('entering a skipped week updates later tables without inventing other submitted weeks', async () => {
    await update({ gameweekId: 3 })
    await update({ gameweekId: 1 })
    const later = await getSummary(3)
    expect(later.table.every((row: any) => row.played === 2 && row.drawn === 2)).toBe(true)
    expect(later.groups[0].every((row: any) => row.played === 2 && row.drawn === 2)).toBe(true)
    expect(await db.Summary.findByPk(2)).toBeNull()
    await assertLiveMatchesSaved(3)
  })

  test('a later correction preserves earlier historical results', async () => {
    await update(scores(1))
    await update(scores(3))
    const earlier = await getSummary(1)
    await update(scores(3, 4))
    expect(await getSummary(1)).toEqual(earlier)
    await assertLiveMatchesSaved(3)
  })

  test('deleting an entire week removes it from later tables without recreating it', async () => {
    await update(scores(1))
    await update(scores(3))
    await deleteResults(1)
    expect(await db.Goal.count({ where: { gameweekId: 1 } })).toBe(0)
    expect(await db.Concede.count({ where: { gameweekId: 1 } })).toBe(0)
    expect(await db.Summary.findByPk(1)).toBeNull()
    expect((await getSummary(3)).table.every((row: any) => row.played === 1)).toBe(true)
    await assertLiveMatchesSaved(3)
  })

  test.each(['goal', 'concede'] as const)('deleting one %s preserves other scores and refreshes later tables', async kind => {
    await update(scores(1, 2))
    await update(scores(3))
    const model = kind === 'goal' ? db.Goal : db.Concede
    const entry: any = await model.findOne({ where: { gameweekId: 1, cup: true } })
    const response = await server.inject({ method: 'POST', url: `/${kind}/delete`, payload: { [`${kind}Id`]: entry.get(model.primaryKeyAttribute) } })
    expect(response.statusCode).toBe(200)
    expect(await db.Goal.count({ where: { gameweekId: 1 } })).toBe(kind === 'goal' ? 3 : 4)
    expect(await db.Concede.count({ where: { gameweekId: 1 } })).toBe(kind === 'concede' ? 1 : 2)
    expect(await db.Summary.findByPk(1)).not.toBeNull()
    await assertLiveMatchesSaved(3)
  })

  test('accepting a missed goal refreshes later summaries', async () => {
    await update(scores(1))
    await update(scores(3))
    const entry = await report(2)
    await acceptGoalReport(entry.goalReportId, 99)
    expect((await getSummary(3)).groups[0].find((row: any) => row.managerId === 1).gf).toBe(4)
    await assertLiveMatchesSaved(3)
  })

  test('failed later summary writes roll back a correction and all its summaries', async () => {
    await update(scores(1))
    await update(scores(3))
    const fixture: any = await db.Fixture.findOne({ where: { gameweekId: 1, homeManagerId: 1 } })
    await db.CupResult.create({ fixtureId: fixture.fixtureId, winnerManagerId: 1, decidedBy: 'lots' })
    const before = [await getSummary(1), await getSummary(3)]
    failLaterSummary()
    await expect(update(scores(1, 5))).rejects.toThrow('Summary write failed')
    expect(await db.Goal.count({ where: { gameweekId: 1, cup: true } })).toBe(1)
    expect([await getSummary(1), await getSummary(3)]).toEqual(before)
    expect(await db.CupResult.count({ where: { fixtureId: fixture.fixtureId } })).toBe(1)
    await assertLiveMatchesSaved(3)
  })

  test('a failed single-score deletion restores that score and all snapshots', async () => {
    await update(scores(1))
    await update(scores(3))
    const entry: any = await db.Goal.findOne({ where: { gameweekId: 1, cup: true } })
    const before = [await getSummary(1), await getSummary(3)]
    failLaterSummary()
    const response = await server.inject({ method: 'POST', url: '/goal/delete', payload: { goalId: entry.goalId } })
    expect(response.statusCode).toBe(500)
    expect(await db.Goal.findByPk(entry.goalId)).not.toBeNull()
    expect([await getSummary(1), await getSummary(3)]).toEqual(before)
  })

  test('failed summary writes roll back a whole-week deletion', async () => {
    await update(scores(1))
    await update(scores(3))
    const before = await getSummary(3)
    failLaterSummary()
    await expect(deleteResults(1)).rejects.toThrow('Summary write failed')
    expect(await db.Summary.findByPk(1)).not.toBeNull()
    expect(await db.Goal.count({ where: { gameweekId: 1 } })).toBe(2)
    expect(await getSummary(3)).toEqual(before)
  })

  test('failed summary writes roll back goal approval and allow a safe retry', async () => {
    await update(scores(1))
    await update(scores(3))
    const entry = await report()
    failLaterSummary()
    await expect(acceptGoalReport(entry.goalReportId, 99)).rejects.toThrow('Summary write failed')
    expect((await db.GoalReport.findByPk(entry.goalReportId))!.get('status')).toBe('pending')
    expect(await db.Goal.count({ where: { gameweekId: 1, cup: true } })).toBe(1)
    db.Summary.removeHook('beforeUpsert', 'fail-summary')
    await acceptGoalReport(entry.goalReportId, 99)
    expect(await db.Goal.count({ where: { gameweekId: 1, cup: true } })).toBe(2)
    await assertLiveMatchesSaved(3)
  })

  test('concurrent edits to different weeks leave the final cumulative tables consistent', async () => {
    await Promise.all([update(scores(3)), update(scores(1, 2))])
    expect((await getSummary(3)).groups[0].find((row: any) => row.managerId === 1).gf).toBe(3)
    await assertLiveMatchesSaved(3)
  })

  test('simultaneous approvals add the same goal report once', async () => {
    const entry = await report()
    const results = await Promise.allSettled([acceptGoalReport(entry.goalReportId, 99), acceptGoalReport(entry.goalReportId, 99)])
    expect(results.filter(result => result.status === 'fulfilled')).toHaveLength(1)
    expect(await db.Goal.count({ where: { gameweekId: 1, cup: true } })).toBe(1)
    await assertLiveMatchesSaved(1)
  })

  test('simultaneous replacements of the same week save one complete version', async () => {
    await update(scores(3))
    await Promise.all([update(scores(1, 2)), update(scores(1, 4))])
    const goals = await db.Goal.count({ where: { gameweekId: 1, cup: true } })
    expect([2, 4]).toContain(goals)
    expect((await getSummary(1)).scores.find((row: any) => row.managerId === 1).goals).toBe(goals)
    expect((await getSummary(3)).groups[0].find((row: any) => row.managerId === 1).gf).toBe(goals + 1)
    await assertLiveMatchesSaved(3)
  })

  test('a standings request sees one consistent snapshot if results are deleted mid-request', async () => {
    await update(scores(1))
    db.Group.addHook('afterFind', 'delete-during-read', async () => {
      db.Group.removeHook('afterFind', 'delete-during-read')
      await deleteResults(1)
    })
    try {
      const [during] = await getGroupStandings(1)
      expect(during!.table.find(row => row.managerId === 1)).toMatchObject({ played: 1, gf: 1, won: 1 })
      const [after] = await getGroupStandings(1)
      expect(after!.table.every(row => row.played === 0 && row.gf === 0)).toBe(true)
    } finally {
      db.Group.removeHook('afterFind', 'delete-during-read')
    }
  })

  test('cup corrections invalidate every leg of the affected saved tie and preserve unrelated ties', async () => {
    await update(scores(1))
    const legs: any[] = await db.Fixture.bulkCreate([
      { gameweekId: 1, cupId: 1, round: 2, homeManagerId: 1, awayManagerId: 2 },
      { gameweekId: 3, cupId: 1, round: 2, homeManagerId: 2, awayManagerId: 1 },
      { gameweekId: 1, cupId: 1, round: 2, homeManagerId: 3, awayManagerId: 4 },
    ])
    await db.CupResult.bulkCreate(legs.map(leg => ({ fixtureId: leg.fixtureId, winnerManagerId: leg.homeManagerId, decidedBy: 'lots' })))
    await update(scores(1, 2))
    expect((await db.CupResult.findAll()).map((result: any) => result.fixtureId)).toEqual([legs[2].fixtureId])
  })

  test('league-only corrections preserve a saved cup decision when cup data has not changed', async () => {
    await update(scores(1))
    const fixture: any = await db.Fixture.findOne({ where: { gameweekId: 1, homeManagerId: 1 } })
    await db.CupResult.create({ fixtureId: fixture.fixtureId, winnerManagerId: 1, decidedBy: 'lots' })
    await update({ ...scores(1), goals: [{ playerId: 1, goals: 4 }] })
    expect(await db.CupResult.count()).toBe(1)
  })

  test('resolving through the API reads and saves the committed cup scores', async () => {
    await update(scores(1))
    await update(scores(3))
    const fixture: any = await db.Fixture.create({ gameweekId: 1, cupId: 1, round: 2, homeManagerId: 1, awayManagerId: 2 })
    const response = await server.inject({ method: 'POST', url: '/cups/1/resolve', payload: { fixtureId: fixture.fixtureId } })
    expect(response.statusCode).toBe(200)
    expect(await db.CupResult.count({ where: { fixtureId: fixture.fixtureId } })).toBe(1)
    await update(scores(1, 3))
    expect(await db.CupResult.count({ where: { fixtureId: fixture.fixtureId } })).toBe(0)
  })

  test('repairing existing snapshots preserves raw scores and submitted goalless weeks, without creating gaps', async () => {
    await update({ gameweekId: 1 })
    await update({ gameweekId: 3 })
    await db.Summary.update({ summary: { corrupted: true } }, { where: { gameweekId: 3 } })
    await rebuildExistingSummaries()
    expect((await getSummary(3)).groups[0].every((row: any) => row.played === 2 && row.drawn === 2)).toBe(true)
    expect(await db.Summary.count()).toBe(2)
    expect(await db.Summary.findByPk(2)).toBeNull()
    expect(await db.Goal.count()).toBe(0)
    await assertLiveMatchesSaved(3)
  })

  test('standalone summary regeneration also refreshes later snapshots', async () => {
    await update(scores(1))
    await update(scores(3))
    await db.Goal.create({ gameweekId: 1, managerId: 1, playerId: 1, cup: true })
    await createSummary(1)
    await assertLiveMatchesSaved(3)
  })
})
