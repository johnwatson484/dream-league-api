module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    userId: DataTypes.INTEGER,
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING
  }, {
    tableName: 'users',
    freezeTableName: true
  })
  User.associate = function (models) {
    User.belongsToMany(models.role, {
      through: 'userRole',
      foreignKey: 'userId',
      as: 'roles'
    })
  }
  return User
}
