import db from '../data/index.ts'

export async function getManager (managerId: number, includeEmails = false) {
  const include = includeEmails ? [{ model: db.Email, as: 'emails' }] : []
  return db.Manager.findOne({ where: { managerId }, include })
}
