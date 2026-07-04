import db from '../data/index.ts'

export async function getManagers () {
  return db.Manager.findAll({ order: ['name'] })
}
