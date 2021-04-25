module.exports = (sequelize, DataTypes) => {
  const ManagerGroup = sequelize.define('ManagerGroup', {
    managerId: { type: DataTypes.INTEGER, primaryKey: true },
    groupId: { type: DataTypes.INTEGER, primaryKey: true }
  }, {
    tableName: 'managerGroups',
    freezeTableName: true,
    timestamps: false
  })
  ManagerGroup.associate = function (models) {
    ManagerGroup.belongsTo(models.Manager, { foreignKey: 'managerId' })
    ManagerGroup.belongsTo(models.Group, { foreignKey: 'groupId' })
  }
  return ManagerGroup
}
