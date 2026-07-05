import db from '../data/index.ts'

export async function deleteManager (managerId: number): Promise<void> {
  await db.Email.destroy({ where: { managerId } })
  await db.Manager.destroy({ where: { managerId } })
}
