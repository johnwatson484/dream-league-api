module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('roles', {
      roleId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('roles')
  },
}
