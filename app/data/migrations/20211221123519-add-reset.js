module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'resetToken', { type: Sequelize.DataTypes.STRING })
    await queryInterface.addColumn('users', 'resetExpiresAt', { type: Sequelize.DataTypes.DATE })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'resetToken')
    await queryInterface.removeColumn('users', 'resetExpiresAt')
  }
}
