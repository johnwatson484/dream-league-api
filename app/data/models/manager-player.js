module.exports = (sequelize, DataTypes) => {
  const ManagerPlayer = sequelize.define('ManagerPlayer', {
    managerId: { type: DataTypes.INTEGER, primaryKey: true },
    playerId: { type: DataTypes.INTEGER, primaryKey: true },
    substitute: DataTypes.BOOLEAN
  }, {
    tableName: 'managerPlayers',
    freezeTableName: true,
    timestamps: false
  })
  ManagerPlayer.associate = function (models) {
    ManagerPlayer.belongsTo(models.Manager, { foreignKey: 'managerId' })
    ManagerPlayer.belongsTo(models.Player, { foreignKey: 'playerId' })
  }
  return ManagerPlayer
}
