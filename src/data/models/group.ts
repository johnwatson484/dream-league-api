import type { Sequelize } from 'sequelize'
import type { DataTypesStatic, Db } from '../types.ts'

export default function defineGroupModel (sequelize: Sequelize, DataTypes: DataTypesStatic) {
  const Group = sequelize.define('Group', {
    groupId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cupId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    groupLegs: DataTypes.INTEGER,
    teamsAdvancing: DataTypes.INTEGER,
  }, {
    tableName: 'groups',
    freezeTableName: true,
    timestamps: false,
  })
  ;(Group as any).associate = function (models: Db) {
    Group.belongsTo(models.Cup, {
      foreignKey: 'cupId',
      as: 'cup',
    })
    Group.belongsToMany(models.Manager, {
      through: 'managerGroups',
      foreignKey: 'groupId',
      as: 'managers',
    })
  }
  return Group
}
