module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('userRole', {
    userId: { type: DataTypes.INTEGER, primaryKey: true },
    roleId: { type: DataTypes.INTEGER, primaryKey: true }
  }, {
    tableName: 'userRoles',
    freezeTableName: true,
    timestamps: false
  })
  UserRole.associate = function (models) {
    UserRole.belongsTo(models.user, { foreignKey: 'userId' })
    UserRole.belongsTo(models.role, { foreignKey: 'roleId' })
  }
  return UserRole
}
