import type { Sequelize } from 'sequelize'
import type { DataTypesStatic, Db } from '../types.ts'

export default (sequelize: Sequelize, DataTypes: DataTypesStatic) => {
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
  ;(User as any).associate = function (models: Db) {
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
