module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('history', {
      historyId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      year: Sequelize.INTEGER,
      teams: Sequelize.INTEGER,
      league1: Sequelize.STRING,
      league2: Sequelize.STRING,
      cup: Sequelize.STRING,
      leagueCup: Sequelize.STRING,
      plate: Sequelize.STRING
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('history')
  }
}
