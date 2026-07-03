module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('managerKeepers', {
      managerId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      teamId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      substitute: Sequelize.BOOLEAN,
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('managerKeepers')
  },
}
