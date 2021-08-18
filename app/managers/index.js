const db = require('../data')

async function getManagers () {
  return db.Manager.findAll({ order: ['name'] })
}

async function getManager (managerId) {
  return db.Manager.findOne({ where: { managerId: managerId }, include: [{ model: db.Email, as: 'emails' }] })
}

async function createManager (manager) {
  const createdManager = await db.Manager.create(manager)
  for (const email of manager.emails) {
    if (email.length) {
      await db.Email.create({ managerId: createdManager.managerId, address: email })
    }
  }
  return createdManager
}

async function editManager (manager) {
  const updatedManager = await db.Manager.upsert(manager)
  const currentEmails = await db.Email.findAll({ where: { managerId: manager.managerId } })
  for (const email of manager.emails) {
    if (!currentEmails.some(x => x.address === email)) {
      if (email.length) {
        await db.Email.create({ managerId: manager.managerId, address: email })
      }
    }
  }
  for (const currentEmail of currentEmails) {
    if (!manager.emails.some(x => x === currentEmail.address)) {
      await db.Email.destroy({ where: { emailId: currentEmail.emailId } })
    }
  }
  return updatedManager
}

async function deleteManager (managerId) {
  await db.Email.destroy({ where: { managerId } })
  await db.Manager.destroy({ where: { managerId } })
}

module.exports = {
  getManagers,
  getManager,
  createManager,
  editManager,
  deleteManager
}
