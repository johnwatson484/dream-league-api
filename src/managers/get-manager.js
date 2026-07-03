import db from '../data/index.js'

const getManager = async (managerId) => {
  return db.Manager.findOne({ where: { managerId }, include: [{ model: db.Email, as: 'emails' }] })
}

export { getManager }
