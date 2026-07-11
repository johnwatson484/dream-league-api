module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('teamsheet', 'confidence', {
      type: Sequelize.FLOAT,
      allowNull: true,
    })

    await queryInterface.addColumn('teamsheet', 'category', {
      type: Sequelize.STRING,
      allowNull: true,
    })

    await queryInterface.addColumn('teamsheet', 'parsedName', {
      type: Sequelize.STRING,
      allowNull: true,
    })

    await queryInterface.addColumn('teamsheet', 'parsedTeam', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('teamsheet', 'parsedTeam')
    await queryInterface.removeColumn('teamsheet', 'parsedName')
    await queryInterface.removeColumn('teamsheet', 'category')
    await queryInterface.removeColumn('teamsheet', 'confidence')
  },
}
