import db from '../data/index.ts'

interface GeneratedFixture {
  cupId: number
  gameweekId: number
  homeManagerId: number
  awayManagerId: number
  round: number
}

interface GroupData {
  groupId: number
  managerIds: number[]
  groupLegs: number
}

export async function generateFixtures (cupId: number, gameweekIds: number[]): Promise<GeneratedFixture[]> {
  const groups = await db.Group.findAll({
    where: { cupId },
    include: [{ model: db.Manager, as: 'managers', attributes: ['managerId'], through: { attributes: [] } }],
  } as any)

  const groupsData: GroupData[] = groups.map((group: any) => ({
    groupId: group.groupId,
    managerIds: group.managers.map((m: any) => m.managerId),
    groupLegs: group.groupLegs || 1,
  }))

  const requiredWeeks = calculateRequiredWeeks(groupsData)
  if (gameweekIds.length < requiredWeeks) {
    throw new Error(`Not enough gameweeks selected. Need at least ${requiredWeeks}, got ${gameweekIds.length}.`)
  }

  const allFixtures: GeneratedFixture[] = []

  for (const group of groupsData) {
    const fixtures = generateGroupFixtures(group.managerIds, group.groupLegs, gameweekIds, cupId)
    allFixtures.push(...fixtures)
  }

  const transaction = await db.sequelize.transaction()
  try {
    for (const fixture of allFixtures) {
      await db.Fixture.create(fixture as any, { transaction })
    }
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }

  return allFixtures
}

export function calculateRequiredWeeks (groupsData: { managerIds: number[]; groupLegs: number }[]): number {
  let max = 0
  for (const group of groupsData) {
    const n = group.managerIds.length
    const roundsPerLeg = n % 2 === 0 ? n - 1 : n
    const totalRounds = roundsPerLeg * group.groupLegs
    if (totalRounds > max) { max = totalRounds }
  }
  return max
}

function generateGroupFixtures (managerIds: number[], groupLegs: number, gameweekIds: number[], cupId: number): GeneratedFixture[] {
  const managers = [...managerIds]
  let totalManagers = managers.length

  if (totalManagers % 2 !== 0) {
    managers.push(-1)
    totalManagers++
  }

  const allRawFixtures: RawFixture[] = []

  for (let leg = 0; leg < groupLegs; leg++) {
    const managerFixtures = calculateManagerFixtures(totalManagers)
    const legFixtures = calculateFixtureProperties(managerFixtures, managers, leg)
    const offsetFixtures = legFixtures.map(f => ({
      ...f,
      weekIndex: f.weekIndex + (leg * (totalManagers - 1)),
    }))
    allRawFixtures.push(...offsetFixtures)
  }

  const confirmedFixtures = calculateFixtureWeeks(allRawFixtures, totalManagers)
  confirmedFixtures.sort((a, b) => a.weekIndex - b.weekIndex)

  return confirmedFixtures
    .filter(f => f.homeManagerId !== -1 && f.awayManagerId !== -1)
    .map(f => ({
      cupId,
      gameweekId: gameweekIds[f.weekIndex] || gameweekIds.at(-1)!,
      homeManagerId: f.homeManagerId,
      awayManagerId: f.awayManagerId,
      round: 1,
    }))
}

interface ManagerMatch {
  managerIndex: number
  matches: number[]
}

interface RawFixture {
  weekIndex: number
  homeManagerId: number
  awayManagerId: number
}

function calculateManagerFixtures (numberOfTeams: number): ManagerMatch[] {
  const rounds = Array.from({ length: numberOfTeams - 1 }, (_, j) => calculateRound(numberOfTeams, j))
  return Array.from({ length: numberOfTeams }, (_, i) => ({
    managerIndex: i,
    matches: rounds.map(round => round[i]!),
  }))
}

function calculateRound (numberOfTeams: number, j: number): number[] {
  const m = numberOfTeams - 1
  const round = Array.from({ length: numberOfTeams }, (_, i) => (m + j - i) % m)
  round[m] = j * (numberOfTeams >> 1) % m
  round[round[m]!] = m
  return round
}

function calculateFixtureProperties (managerFixtures: ManagerMatch[], managers: number[], leg: number): RawFixture[] {
  const fixtures: RawFixture[] = []
  const seen = new Set<string>()
  const swap = leg % 2 === 1
  for (const manager of managerFixtures) {
    for (let i = 0; i < manager.matches.length; i++) {
      const home = managers[manager.managerIndex]!
      const away = managers[manager.matches[i]!]!
      const key = `${i}-${Math.min(home, away)}-${Math.max(home, away)}`
      if (seen.has(key)) { continue }
      seen.add(key)
      fixtures.push({
        weekIndex: i,
        homeManagerId: swap ? away : home,
        awayManagerId: swap ? home : away,
      })
    }
  }
  return fixtures
}

function calculateFixtureWeeks (initialFixtures: RawFixture[], totalManagers: number): RawFixture[] {
  const confirmedFixtures: RawFixture[] = []
  for (let i = 0; i < initialFixtures.length; i++) {
    const fixture = initialFixtures[i]!
    const conflicting = confirmedFixtures.find(x =>
      x.weekIndex === fixture.weekIndex && (
        x.homeManagerId === fixture.homeManagerId ||
        x.awayManagerId === fixture.homeManagerId ||
        x.homeManagerId === fixture.awayManagerId ||
        x.awayManagerId === fixture.awayManagerId
      )
    )

    if (conflicting) {
      if (i % 2 === 0) {
        fixture.weekIndex = fixture.weekIndex + totalManagers - 1
      } else {
        conflicting.weekIndex = conflicting.weekIndex + totalManagers - 1
      }
    }

    confirmedFixtures.push(fixture)
  }
  return confirmedFixtures
}
