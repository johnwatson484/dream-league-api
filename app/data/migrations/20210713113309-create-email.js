module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('emails', {
      emailId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      managerId: Sequelize.INTEGER,
      address: Sequelize.STRING

    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('emails')
  }
}
