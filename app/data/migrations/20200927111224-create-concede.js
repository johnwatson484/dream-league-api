module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('conceded', {
      concedeId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      teamId: Sequelize.INTEGER,
      gameweekId: Sequelize.INTEGER,
      managerId: Sequelize.INTEGER,
      cup: Sequelize.BOOLEAN,
      created: Sequelize.DATE,
      createdBy: Sequelize.STRING
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('conceded')
  }
}
