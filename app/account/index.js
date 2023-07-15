const { register } = require('./register')
const { login } = require('./login')
const { resetPassword, setNewPassword } = require('./reset-password')
const { getUser } = require('./user-manager')

module.exports = {
  register,
  login,
  resetPassword,
  setNewPassword,
  getUser
}
