module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('teamsheet', {
      teamsheetId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      managerId: Sequelize.INTEGER,
      player: Sequelize.STRING,
      position: Sequelize.STRING,
      substitute: Sequelize.BOOLEAN,
      bestMatchId: Sequelize.INTEGER,
      distance: Sequelize.INTEGER,
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('teamsheet')
  },
}
