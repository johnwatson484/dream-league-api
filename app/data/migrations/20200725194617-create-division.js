module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('divisions', {
      divisionId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: Sequelize.STRING,
      rank: Sequelize.INTEGER
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('divisions')
  }
}
