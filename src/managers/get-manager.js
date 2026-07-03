import db from '../data/index.js'

export async function getManager (managerId, includeEmails = false) {
  const include = includeEmails ? [{ model: db.Email, as: 'emails' }] : []
  return db.Manager.findOne({ where: { managerId }, include })
}
