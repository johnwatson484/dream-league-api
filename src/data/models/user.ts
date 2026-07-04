export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    resetToken: DataTypes.STRING,
    resetExpiresAt: DataTypes.DATE,
    refreshToken: DataTypes.STRING,
    refreshTokenExpiresAt: DataTypes.DATE,
    tokenVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    tableName: 'users',
    freezeTableName: true,
    timestamps: false,
  })
  User.associate = function (models) {
    User.belongsToMany(models.Role, {
      through: 'userRole',
      foreignKey: 'userId',
      as: 'roles',
      onDelete: 'CASCADE',
    })
    User.hasMany(models.RefreshToken, {
      foreignKey: 'userId',
      as: 'refreshTokens',
    })
  }
  return User
}
