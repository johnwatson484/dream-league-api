module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('cups', [
      { cupId: 1, name: 'Cup', hasGroupStage: true, knockoutLegs: 2 },
      { cupId: 2, name: 'League Cup', hasGroupStage: false, knockoutLegs: 1 },
    ], { ignoreDuplicates: true })
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('cups', { cupId: [1, 2] })
  },
}
