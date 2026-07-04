module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('refreshTokens', 'familyCreatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    })
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('refreshTokens', 'familyCreatedAt')
  },
}
