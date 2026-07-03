import db from '../data/index.js'

export async function getManagers () {
  return db.Manager.findAll({ order: ['name'] })
}
