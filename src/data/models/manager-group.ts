import type { Sequelize } from 'sequelize'
import type { DataTypesStatic, Db } from '../types.ts'

export default function defineManagerGroupModel (sequelize: Sequelize, DataTypes: DataTypesStatic) {
  const ManagerGroup = sequelize.define('ManagerGroup', {
    managerId: { type: DataTypes.INTEGER, primaryKey: true },
    groupId: { type: DataTypes.INTEGER, primaryKey: true },
  }, {
    tableName: 'managerGroups',
    freezeTableName: true,
    timestamps: false,
  })
  ;(ManagerGroup as any).associate = function (models: Db) {
    ManagerGroup.belongsTo(models.Manager, { foreignKey: 'managerId' })
    ManagerGroup.belongsTo(models.Group, { foreignKey: 'groupId' })
  }
  return ManagerGroup
}
