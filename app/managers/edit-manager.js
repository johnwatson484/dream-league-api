const db = require('../data')

const editManager = async (manager) => {
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

module.exports = {
  editManager,
}
