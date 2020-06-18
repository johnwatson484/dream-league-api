const token = require('../token')
const boom = require('@hapi/boom')
const db = require('../data/models')
const bcrypt = require('bcrypt')

async function login (email, password) {
  const user = await getUser(email)

  if (user === undefined) {
    return boom.unauthorized()
  }

  if (!await bcrypt.compare(password, user.password)) {
    return boom.unauthorized()
  }

  return {
    token: token.create(user)
  }
}

async function getUser (email) {
  return db.user.findOne({
    where: { email },
    include: [db.roles]
  })
}

module.exports = login
