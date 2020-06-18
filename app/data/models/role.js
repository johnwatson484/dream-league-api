module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('role', {
    roleId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    tableName: 'roles',
    freezeTableName: true
  })
  Role.associate = function (models) {
    Role.belongsToMany(models.user, {
      through: 'userRole',
      foreignKey: 'roleId',
      as: 'users'
    })
  }
  return Role
}
