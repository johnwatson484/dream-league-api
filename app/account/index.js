module.exports = {
  register: require('./register'),
  login: require('./login'),
  getUser: require('./user-manager').getUser
}
