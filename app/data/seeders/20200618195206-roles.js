module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roles', [{
      roleId: 1,
      name: 'admin'
    }, {
      roleId: 2,
      name: 'user'
    }], {
      ignoreDuplicates: true
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, {})
  }
}
