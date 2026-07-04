import db from '../data/index.ts'

export async function createManager (manager) {
  const createdManager = await db.Manager.create(manager)
  for (const email of manager.emails) {
    if (email.length) {
      await db.Email.create({ managerId: createdManager.managerId, address: email })
    }
  }
  return createdManager
}
