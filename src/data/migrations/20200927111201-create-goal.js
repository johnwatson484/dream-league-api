module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('goals', {
      goalId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      playerId: Sequelize.INTEGER,
      gameweekId: Sequelize.INTEGER,
      managerId: Sequelize.INTEGER,
      cup: Sequelize.BOOLEAN,
      created: Sequelize.DATE,
      createdBy: Sequelize.STRING,
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('goals')
  },
}
