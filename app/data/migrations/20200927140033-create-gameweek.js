module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('gameweeks', {
      gameweekId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      startDate: Sequelize.DATE,
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('gameweeks')
  },
}
