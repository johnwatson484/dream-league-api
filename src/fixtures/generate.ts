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
}

export async function generateFixtures (cupId: number, gameweekIds: number[]): Promise<GeneratedFixture[]> {
  const groups = await db.Group.findAll({
    where: { cupId },
    include: [{ model: db.Manager, as: 'managers', attributes: ['managerId'], through: { attributes: [] } }],
  } as any)

  const groupsData: GroupData[] = groups.map((group: any) => ({
    groupId: group.groupId,
    managerIds: group.managers.map((m: any) => m.managerId),
  }))

  const allFixtures: GeneratedFixture[] = []

  for (const group of groupsData) {
    const fixtures = generateGroupFixtures(group.managerIds, gameweekIds, cupId)
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

function generateGroupFixtures (managerIds: number[], gameweekIds: number[], cupId: number): GeneratedFixture[] {
  const managers = [...managerIds]
  let totalManagers = managers.length

  if (totalManagers % 2 !== 0) {
    managers.push(-1)
    totalManagers++
  }

  const managerFixtures = calculateManagerFixtures(totalManagers)
  const initialFixtures = calculateFixtureProperties(managerFixtures, managers)
  const confirmedFixtures = calculateFixtureWeeks(initialFixtures, totalManagers)

  confirmedFixtures.sort((a, b) => a.weekIndex - b.weekIndex)

  return confirmedFixtures
    .filter(f => f.homeManagerId !== -1 && f.awayManagerId !== -1)
    .map(f => ({
      cupId,
      gameweekId: gameweekIds[f.weekIndex] || gameweekIds[gameweekIds.length - 1]!,
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

function calculateFixtureProperties (managerFixtures: ManagerMatch[], managers: number[]): RawFixture[] {
  const fixtures: RawFixture[] = []
  for (const manager of managerFixtures) {
    for (let i = 0; i < manager.matches.length; i++) {
      fixtures.push({
        weekIndex: i,
        homeManagerId: managers[manager.managerIndex]!,
        awayManagerId: managers[manager.matches[i]!]!,
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
