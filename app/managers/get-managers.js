const db = require('../data')

const getManagers = async () => {
  return db.Manager.findAll({ order: ['name'] })
}

module.exports = {
  getManagers
}
