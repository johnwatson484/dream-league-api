module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('userRole', {
    userId: DataTypes.INTEGER,
    roleId: DataTypes.INTEGER
  }, {
    tableName: 'userRoles',
    freezeTableName: true
  })
  return UserRole
}
