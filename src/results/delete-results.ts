import db from '../data/index.ts'

export async function deleteResults (gameweekId: number): Promise<void> {
  const transaction = await db.sequelize.transaction()
  try {
    await db.Concede.destroy({ where: { gameweekId }, transaction })
    await db.Goal.destroy({ where: { gameweekId }, transaction })
    await db.Summary.destroy({ where: { gameweekId }, transaction })
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
