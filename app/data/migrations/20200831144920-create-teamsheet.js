module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('teamsheets', {
      teamsheetId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      managerId: Sequelize.INTEGER,
      player: Sequelize.STRING,
      position: Sequelize.STRING,
      bestMatchId: Sequelize.INTEGER,
      distance: Sequelize.INTEGER
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('teamsheets')
  }
}
