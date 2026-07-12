module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('goalReports', {
      goalReportId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      playerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      managerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      gameweekId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      goals: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      goalsCup: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending',
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      submittedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      reviewedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      reviewedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('goalReports')
  },
}
