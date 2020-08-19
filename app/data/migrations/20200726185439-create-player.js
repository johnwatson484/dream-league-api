'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('players', {
      playerId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      teamId: Sequelize.INTEGER,
      firstName: Sequelize.STRING,
      lastName: Sequelize.STRING,
      alias: Sequelize.STRING,
      position: Sequelize.STRING
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('players')
  }
}
