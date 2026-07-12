import db from '../data/index.ts'

export async function createManager (manager: any) {
  const createdManager: any = await db.Manager.create({ name: manager.name, alias: manager.alias })
  for (const email of manager.emails ?? []) {
    if (email.length) {
      await db.Email.create({ managerId: createdManager.managerId, address: email })
    }
  }
  return createdManager
}
