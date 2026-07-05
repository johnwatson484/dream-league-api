import type { Sequelize } from 'sequelize'
import type { DataTypesStatic, Db } from '../types.ts'

export default (sequelize: Sequelize, DataTypes: DataTypesStatic) => {
  const Cup = sequelize.define('Cup', {
    cupId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    hasGroupStage: DataTypes.BOOLEAN,
    knockoutLegs: DataTypes.INTEGER,
  }, {
    tableName: 'cups',
    freezeTableName: true,
    timestamps: false,
  })
  ;(Cup as any).associate = function (models: Db) {
    Cup.hasMany(models.Group, {
      foreignKey: 'cupId',
      as: 'groups',
    })
    Cup.hasMany(models.Fixture, {
      foreignKey: 'cupId',
      as: 'fixtures',
    })
  }
  return Cup
}
