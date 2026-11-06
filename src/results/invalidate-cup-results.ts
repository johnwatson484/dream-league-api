import { Op, type Transaction } from 'sequelize'
import db from '../data/index.ts'

export async function getCupScoreState (gameweekId: number, transaction: Transaction): Promise<Map<number, string>> {
  const goals = await db.Goal.findAll({ where: { gameweekId, cup: true }, attributes: ['managerId', 'playerId', 'matchTime'], raw: true, transaction })
  const conceded = await db.Concede.findAll({ where: { gameweekId, cup: true }, attributes: ['managerId', 'teamId'], raw: true, transaction })
  const managers = new Map<number, string[]>()
  for (const [kind, rows] of [['goal', goals], ['concede', conceded]] as const) {
    for (const row of rows as any[]) {
      const state = managers.get(row.managerId) ?? []
      state.push(`${kind}:${JSON.stringify(row)}`)
      managers.set(row.managerId, state)
    }
  }
  return new Map([...managers].map(([managerId, state]) => [managerId, JSON.stringify(state.toSorted((a, b) => a.localeCompare(b)))]))
}

export async function invalidateCupResults (gameweekId: number, transaction: Transaction, managerIds?: number[]): Promise<void> {
  const changedFixtures = await db.Fixture.findAll({
    where: {
      gameweekId,
      ...(managerIds ? { [Op.or]: [{ homeManagerId: managerIds }, { awayManagerId: managerIds }] } : {}),
    },
    transaction,
  })
  if (!changedFixtures.length) { return }

  // A saved aggregate may be attached to any leg of the affected tie.
  const fixtures = await db.Fixture.findAll({
    where: {
      [Op.or]: changedFixtures.map((fixture: any) => ({
        cupId: fixture.cupId,
        round: fixture.round,
        [Op.or]: [
          { homeManagerId: fixture.homeManagerId, awayManagerId: fixture.awayManagerId },
          { homeManagerId: fixture.awayManagerId, awayManagerId: fixture.homeManagerId },
        ],
      })),
    },
    transaction,
  })
  await db.CupResult.destroy({ where: { fixtureId: fixtures.map((fixture: any) => fixture.fixtureId) }, transaction })
}
