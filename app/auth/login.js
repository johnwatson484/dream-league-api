const users = require('./users.json')
const token = require('../token')
const boom = require('@hapi/boom')

function login (username, password) {
  const user = getUser(username, password)

  if (user === undefined) {
    return boom.unauthorized()
  }

  return {
    token: token.create(user)
  }
}

function getUser (username, password) {
  return users.find(x => x.username.toLowerCase() === username && x.password === password)
}

module.exports = login
