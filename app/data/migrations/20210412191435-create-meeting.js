module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('meetings', {
      meetingId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      date: Sequelize.DATE
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('meetings')
  }
}
