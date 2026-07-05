import db from '../data/index.ts'

interface RescheduleItem {
  fixtureId: number
  gameweekId: number
}

export async function rescheduleFixtures (fixtures: RescheduleItem[]): Promise<void> {
  const transaction = await db.sequelize.transaction()
  try {
    for (const item of fixtures) {
      await db.Fixture.update(
        { gameweekId: item.gameweekId },
        { where: { fixtureId: item.fixtureId }, transaction }
      )
    }
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
