import db from '../data/index.js'

const getManagers = async () => {
  return db.Manager.findAll({ order: ['name'] })
}

export { getManagers }
