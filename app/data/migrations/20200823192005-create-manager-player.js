module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('managerPlayers', {
      managerId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      playerId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('managerPlayers')
  }
}
