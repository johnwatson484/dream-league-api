module.exports = (sequelize, DataTypes) => {
  const ManagerKeeper = sequelize.define('ManagerKeeper', {
    managerId: { type: DataTypes.INTEGER, primaryKey: true },
    teamId: { type: DataTypes.INTEGER, primaryKey: true },
    substitute: DataTypes.BOOLEAN
  }, {
    tableName: 'managerKeepers',
    freezeTableName: true,
    timestamps: false
  })
  ManagerKeeper.associate = function (models) {
    ManagerKeeper.belongsTo(models.Manager, { foreignKey: 'managerId' })
    ManagerKeeper.belongsTo(models.Team, { foreignKey: 'teamId' })
  }
  return ManagerKeeper
}
