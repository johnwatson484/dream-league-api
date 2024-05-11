module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('divisions', [{
      divisionId: 1,
      name: 'Championship',
      shortName: 'C',
      rank: 1
    }, {
      divisionId: 2,
      name: 'League 1',
      shortName: 'L1',
      rank: 2
    }, {
      divisionId: 3,
      name: 'League 2',
      shortName: 'L2',
      rank: 3
    }, {
      divisionId: 4,
      name: 'None',
      shortName: 'N',
      rank: 4
    }], {
      ignoreDuplicates: true
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('divisions', null, {})
  }
}
