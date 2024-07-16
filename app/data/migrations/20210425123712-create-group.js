module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('groups', {
      groupId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cupId: Sequelize.INTEGER,
      name: Sequelize.STRING,
      groupLegs: Sequelize.INTEGER,
      teamsAdvancing: Sequelize.INTEGER,
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('groups')
  },
}
