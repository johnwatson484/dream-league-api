const db = require('../data')

const getManager = async (managerId) => {
  return db.Manager.findOne({ where: { managerId }, include: [{ model: db.Email, as: 'emails' }] })
}

module.exports = {
  getManager
}
