module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'refreshToken', {
      type: Sequelize.STRING,
      allowNull: true,
    })
    await queryInterface.addColumn('users', 'refreshTokenExpiresAt', {
      type: Sequelize.DATE,
      allowNull: true,
    })
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'refreshToken')
    await queryInterface.removeColumn('users', 'refreshTokenExpiresAt')
  },
}
