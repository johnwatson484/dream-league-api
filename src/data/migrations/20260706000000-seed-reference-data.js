module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('roles', [
      { roleId: 1, name: 'admin' },
      { roleId: 2, name: 'user' },
    ], { ignoreDuplicates: true })

    await queryInterface.bulkInsert('divisions', [
      { divisionId: 1, name: 'Championship', shortName: 'C', rank: 1 },
      { divisionId: 2, name: 'League 1', shortName: 'L1', rank: 2 },
      { divisionId: 3, name: 'League 2', shortName: 'L2', rank: 3 },
      { divisionId: 4, name: 'None', shortName: 'N', rank: 4 },
    ], { ignoreDuplicates: true })
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('roles', { roleId: [1, 2] })
    await queryInterface.bulkDelete('divisions', { divisionId: [1, 2, 3, 4] })
  },
}
