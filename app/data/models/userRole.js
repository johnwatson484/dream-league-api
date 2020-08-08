module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    userId: { type: DataTypes.INTEGER, primaryKey: true },
    roleId: { type: DataTypes.INTEGER, primaryKey: true }
  }, {
    tableName: 'userRoles',
    freezeTableName: true,
    timestamps: false
  })
  UserRole.associate = function (models) {
    UserRole.belongsTo(models.User, { foreignKey: 'userId' })
    UserRole.belongsTo(models.Role, { foreignKey: 'roleId' })
  }
  return UserRole
}
