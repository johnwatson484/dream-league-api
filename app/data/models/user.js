module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    resetToken: DataTypes.STRING,
    resetExpiresAt: DataTypes.DATE
  }, {
    tableName: 'users',
    freezeTableName: true,
    timestamps: false
  })
  User.associate = function (models) {
    User.belongsToMany(models.Role, {
      through: 'userRole',
      foreignKey: 'userId',
      as: 'roles',
      onDelete: 'CASCADE'
    })
  }
  return User
}
