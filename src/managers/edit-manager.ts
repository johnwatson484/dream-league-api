import db from '../data/index.ts'

export async function editManager (manager: any) {
  const updatedManager = await db.Manager.upsert(manager)
  const currentEmails: any[] = await db.Email.findAll({ where: { managerId: manager.managerId } })
  for (const email of manager.emails) {
    if (!currentEmails.some((x: any) => x.address === email)) {
      if (email.length) {
        await db.Email.create({ managerId: manager.managerId, address: email })
      }
    }
  }
  for (const currentEmail of currentEmails) {
    if (!manager.emails.includes((currentEmail as any).address)) {
      await db.Email.destroy({ where: { emailId: (currentEmail as any).emailId } })
    }
  }
  return updatedManager
}
