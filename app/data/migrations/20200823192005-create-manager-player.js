module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('managerPlayers', {
      managerId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      playerId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      substitute: Sequelize.BOOLEAN,
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('managerPlayers')
  },
}
