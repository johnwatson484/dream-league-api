module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn('divisions', 'shortName', { type: Sequelize.DataTypes.STRING }, { transaction })
      await queryInterface.sequelize.query("UPDATE divisions SET \"shortName\" = 'C' WHERE \"divisionId\" = 1", { transaction })
      await queryInterface.sequelize.query("UPDATE divisions SET \"shortName\" = 'L1' WHERE \"divisionId\" = 2", { transaction })
      await queryInterface.sequelize.query("UPDATE divisions SET \"shortName\" = 'L2' WHERE \"divisionId\" = 3", { transaction })
      await queryInterface.sequelize.query("UPDATE divisions SET \"shortName\" = 'N' WHERE \"divisionId\" = 4", { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('divisions', 'shortName')
  },
}
