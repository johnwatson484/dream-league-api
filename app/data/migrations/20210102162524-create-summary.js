module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('summaries', {
      gameweekId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      summary: Sequelize.JSON
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('summaries')
  }
}
