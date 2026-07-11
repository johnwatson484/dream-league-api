module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('goals', 'matchTime', {
      type: Sequelize.DATE,
      allowNull: true,
    })

    await queryInterface.createTable('cupResults', {
      cupResultId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fixtureId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      winnerManagerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      homeAggregate: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      awayAggregate: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      decidedBy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('cupResults')
    await queryInterface.removeColumn('goals', 'matchTime')
  },
}
