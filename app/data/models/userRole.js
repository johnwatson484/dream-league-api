module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('userRole', {
    userId: { type: DataTypes.INTEGER, primaryKey: true },
    roleId: { type: DataTypes.INTEGER, primaryKey: true }
  }, {
    tableName: 'userRoles',
    freezeTableName: true,
    timestamps: false
  })
  return UserRole
}
