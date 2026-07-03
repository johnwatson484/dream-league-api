module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cups', {
      cupId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: Sequelize.STRING,
      hasGroupStage: Sequelize.BOOLEAN,
      knockoutLegs: Sequelize.INTEGER,
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cups')
  },
}
