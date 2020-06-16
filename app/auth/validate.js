const users = require('./users.json')

async function validate (decoded, request, h) {
  console.log(decoded)
  if (!users[decoded.id]) {
    return { isValid: false }
  }
  return { isValid: true }
}

module.exports = validate
