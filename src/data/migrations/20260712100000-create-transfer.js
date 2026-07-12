module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transfers', {
      transferId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      managerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      playerInId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      playerOutId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      meetingId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('transfers')
  },
}
