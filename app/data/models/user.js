module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    tableName: 'users',
    freezeTableName: true
  })
  User.associate = function (models) {
    User.belongsToMany(models.role, {
      through: 'userRole',
      foreignKey: 'userId',
      otherKey: 'roleId',
      as: 'roles'
    })
  }
  return User
}
