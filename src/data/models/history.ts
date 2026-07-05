import type { Sequelize } from 'sequelize'
import type { DataTypesStatic } from '../types.ts'

export default (sequelize: Sequelize, DataTypes: DataTypesStatic) => {
  return sequelize.define('History', {
    historyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    year: DataTypes.INTEGER,
    teams: DataTypes.INTEGER,
    league1: DataTypes.STRING,
    league2: DataTypes.STRING,
    cup: DataTypes.STRING,
    leagueCup: DataTypes.STRING,
    plate: DataTypes.STRING,
  }, {
    tableName: 'history',
    freezeTableName: true,
    timestamps: false,
  })
}
