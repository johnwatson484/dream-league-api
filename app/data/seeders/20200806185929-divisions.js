module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('divisions', [{
      divisionId: 1,
      name: 'Championship',
      rank: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      divisionId: 2,
      name: 'League 1',
      rank: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      divisionId: 3,
      name: 'League 2',
      rank: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {
      ignoreDuplicates: true
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('divisions', null, {})
  }
}
