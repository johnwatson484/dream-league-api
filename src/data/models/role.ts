import type { Sequelize } from 'sequelize'
import type { DataTypesStatic, Db } from '../types.ts'

export default (sequelize: Sequelize, DataTypes: DataTypesStatic) => {
  const Role = sequelize.define('Role', {
    roleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
  }, {
    tableName: 'roles',
    freezeTableName: true,
    timestamps: false,
  })
  ;(Role as any).associate = function (models: Db) {
    Role.belongsToMany(models.User, {
      through: 'userRole',
      foreignKey: 'roleId',
      as: 'users',
      onDelete: 'CASCADE',
    })
  }
  return Role
}
