import type { Sequelize } from 'sequelize'
import type { DataTypesStatic, Db } from '../types.ts'

export default function defineUserRoleModel (sequelize: Sequelize, DataTypes: DataTypesStatic) {
  const UserRole = sequelize.define('UserRole', {
    userId: { type: DataTypes.INTEGER, primaryKey: true },
    roleId: { type: DataTypes.INTEGER, primaryKey: true },
  }, {
    tableName: 'userRoles',
    freezeTableName: true,
    timestamps: false,
  })
  ;(UserRole as any).associate = function (models: Db) {
    UserRole.belongsTo(models.User, { foreignKey: 'userId' })
    UserRole.belongsTo(models.Role, { foreignKey: 'roleId' })
  }
  return UserRole
}
