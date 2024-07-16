'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('fixtures', {
      fixtureId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cupId: Sequelize.INTEGER,
      gameweekId: Sequelize.INTEGER,
      homeManagerId: Sequelize.INTEGER,
      awayManagerId: Sequelize.INTEGER,
      round: Sequelize.INTEGER,
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('fixtures')
  },
}
