import { Op } from 'sequelize'
import db from '../data/index.ts'

type DecidedBy = 'margin' | 'goals' | 'third_leg' | 'first_goal' | 'lots'

interface ResolutionResult {
  winnerManagerId: number | null
  homeAggregate: number
  awayAggregate: number
  decidedBy: DecidedBy | null
  status: 'resolved' | 'needs_third_leg' | 'needs_manual_resolution'
}

export async function resolveFixture (fixtureId: number): Promise<ResolutionResult> {
  const fixture: any = await db.Fixture.findOne({
    where: { fixtureId },
    include: [{ model: db.Cup, as: 'cup' }],
  })

  if (!fixture) { throw new Error('Fixture not found') }

  const cup = fixture.cup
  const knockoutLegs = cup.knockoutLegs || 1

  if (knockoutLegs === 1) {
    return resolveSingleLeg(fixture)
  }

  return resolveTwoLegs(fixture)
}

async function resolveSingleLeg (fixture: any): Promise<ResolutionResult> {
  const homeGoals = await getGoalCount(fixture.homeManagerId, fixture.gameweekId)
  const homeConceded = await getConcedeCount(fixture.homeManagerId, fixture.gameweekId)
  const awayGoals = await getGoalCount(fixture.awayManagerId, fixture.gameweekId)
  const awayConceded = await getConcedeCount(fixture.awayManagerId, fixture.gameweekId)

  const homeMargin = homeGoals - homeConceded
  const awayMargin = awayGoals - awayConceded

  if (homeMargin > awayMargin) {
    return { winnerManagerId: fixture.homeManagerId, homeAggregate: homeMargin, awayAggregate: awayMargin, decidedBy: 'margin', status: 'resolved' }
  }
  if (awayMargin > homeMargin) {
    return { winnerManagerId: fixture.awayManagerId, homeAggregate: homeMargin, awayAggregate: awayMargin, decidedBy: 'margin', status: 'resolved' }
  }

  if (homeGoals > awayGoals) {
    return { winnerManagerId: fixture.homeManagerId, homeAggregate: homeMargin, awayAggregate: awayMargin, decidedBy: 'goals', status: 'resolved' }
  }
  if (awayGoals > homeGoals) {
    return { winnerManagerId: fixture.awayManagerId, homeAggregate: homeMargin, awayAggregate: awayMargin, decidedBy: 'goals', status: 'resolved' }
  }

  const earliestGoal = await getEarliestGoal(fixture.homeManagerId, fixture.awayManagerId, fixture.gameweekId)
  if (earliestGoal) {
    return { winnerManagerId: earliestGoal, homeAggregate: homeMargin, awayAggregate: awayMargin, decidedBy: 'first_goal', status: 'resolved' }
  }

  return { winnerManagerId: null, homeAggregate: homeMargin, awayAggregate: awayMargin, decidedBy: null, status: 'needs_manual_resolution' }
}

async function resolveTwoLegs (fixture: any): Promise<ResolutionResult> {
  const relatedFixtures: any[] = await db.Fixture.findAll({
    where: {
      cupId: fixture.cupId,
      round: fixture.round,
      [Op.or]: [
        { homeManagerId: fixture.homeManagerId, awayManagerId: fixture.awayManagerId },
        { homeManagerId: fixture.awayManagerId, awayManagerId: fixture.homeManagerId },
      ],
    },
  })

  let totalHomeMargin = 0
  let totalAwayMargin = 0
  let totalHomeGoals = 0
  let totalAwayGoals = 0

  for (const f of relatedFixtures) {
    const hGoals = await getGoalCount(f.homeManagerId, f.gameweekId)
    const hConceded = await getConcedeCount(f.homeManagerId, f.gameweekId)
    const aGoals = await getGoalCount(f.awayManagerId, f.gameweekId)
    const aConceded = await getConcedeCount(f.awayManagerId, f.gameweekId)

    if (f.homeManagerId === fixture.homeManagerId) {
      totalHomeMargin += hGoals - hConceded
      totalAwayMargin += aGoals - aConceded
      totalHomeGoals += hGoals
      totalAwayGoals += aGoals
    } else {
      totalHomeMargin += aGoals - aConceded
      totalAwayMargin += hGoals - hConceded
      totalHomeGoals += aGoals
      totalAwayGoals += hGoals
    }
  }

  if (totalHomeMargin > totalAwayMargin) {
    return { winnerManagerId: fixture.homeManagerId, homeAggregate: totalHomeMargin, awayAggregate: totalAwayMargin, decidedBy: 'margin', status: 'resolved' }
  }
  if (totalAwayMargin > totalHomeMargin) {
    return { winnerManagerId: fixture.awayManagerId, homeAggregate: totalHomeMargin, awayAggregate: totalAwayMargin, decidedBy: 'margin', status: 'resolved' }
  }

  if (totalHomeGoals > totalAwayGoals) {
    return { winnerManagerId: fixture.homeManagerId, homeAggregate: totalHomeMargin, awayAggregate: totalAwayMargin, decidedBy: 'goals', status: 'resolved' }
  }
  if (totalAwayGoals > totalHomeGoals) {
    return { winnerManagerId: fixture.awayManagerId, homeAggregate: totalHomeMargin, awayAggregate: totalAwayMargin, decidedBy: 'goals', status: 'resolved' }
  }

  if (relatedFixtures.length < 3) {
    return { winnerManagerId: null, homeAggregate: totalHomeMargin, awayAggregate: totalAwayMargin, decidedBy: null, status: 'needs_third_leg' }
  }

  const gameweekIds = relatedFixtures.map((f: any) => f.gameweekId)
  const earliestGoal = await getEarliestGoalAcrossWeeks(fixture.homeManagerId, fixture.awayManagerId, gameweekIds)
  if (earliestGoal) {
    return { winnerManagerId: earliestGoal, homeAggregate: totalHomeMargin, awayAggregate: totalAwayMargin, decidedBy: 'first_goal', status: 'resolved' }
  }

  return { winnerManagerId: null, homeAggregate: totalHomeMargin, awayAggregate: totalAwayMargin, decidedBy: null, status: 'needs_manual_resolution' }
}

async function getGoalCount (managerId: number, gameweekId: number): Promise<number> {
  return db.Goal.count({ where: { managerId, gameweekId, cup: true } })
}

async function getConcedeCount (managerId: number, gameweekId: number): Promise<number> {
  return db.Concede.count({ where: { managerId, gameweekId, cup: true } })
}

async function getEarliestGoal (homeManagerId: number, awayManagerId: number, gameweekId: number): Promise<number | null> {
  const homeEarliest: any = await db.Goal.findOne({
    where: { managerId: homeManagerId, gameweekId, cup: true, matchTime: { [Op.ne]: null } },
    order: [['matchTime', 'ASC']],
  })
  const awayEarliest: any = await db.Goal.findOne({
    where: { managerId: awayManagerId, gameweekId, cup: true, matchTime: { [Op.ne]: null } },
    order: [['matchTime', 'ASC']],
  })

  if (!homeEarliest && !awayEarliest) { return null }
  if (!awayEarliest) { return homeManagerId }
  if (!homeEarliest) { return awayManagerId }
  return homeEarliest.matchTime < awayEarliest.matchTime ? homeManagerId : awayManagerId
}

async function getEarliestGoalAcrossWeeks (homeManagerId: number, awayManagerId: number, gameweekIds: number[]): Promise<number | null> {
  const homeEarliest: any = await db.Goal.findOne({
    where: { managerId: homeManagerId, gameweekId: gameweekIds, cup: true, matchTime: { [Op.ne]: null } },
    order: [['matchTime', 'ASC']],
  })
  const awayEarliest: any = await db.Goal.findOne({
    where: { managerId: awayManagerId, gameweekId: gameweekIds, cup: true, matchTime: { [Op.ne]: null } },
    order: [['matchTime', 'ASC']],
  })

  if (!homeEarliest && !awayEarliest) { return null }
  if (!awayEarliest) { return homeManagerId }
  if (!homeEarliest) { return awayManagerId }
  return homeEarliest.matchTime < awayEarliest.matchTime ? homeManagerId : awayManagerId
}

export async function manuallyResolve (fixtureId: number, winnerManagerId: number): Promise<void> {
  const existing = await db.CupResult.findOne({ where: { fixtureId } })
  if (existing) {
    await db.CupResult.update({ winnerManagerId, decidedBy: 'lots' }, { where: { fixtureId } })
  } else {
    await db.CupResult.create({ fixtureId, winnerManagerId, homeAggregate: 0, awayAggregate: 0, decidedBy: 'lots' } as any)
  }
}

export async function saveResolution (fixtureId: number, result: ResolutionResult): Promise<void> {
  if (result.status !== 'resolved') { return }
  const existing = await db.CupResult.findOne({ where: { fixtureId } })
  if (existing) {
    await db.CupResult.update(result, { where: { fixtureId } })
  } else {
    await db.CupResult.create({ fixtureId, ...result } as any)
  }
}
