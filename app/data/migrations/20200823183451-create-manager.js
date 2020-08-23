module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('managers', {
      managerId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: Sequelize.STRING,
      alias: Sequelize.STRING
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('managers')
  }
}
