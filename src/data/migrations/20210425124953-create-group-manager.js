module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('managerGroups', {
      managerId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      groupId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('managerGroups')
  },
}
