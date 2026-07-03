import db from '../data/index.js'

export async function getManager (managerId) {
  return db.Manager.findOne({ where: { managerId }, include: [{ model: db.Email, as: 'emails' }] })
}
