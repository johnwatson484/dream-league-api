import type { Sequelize } from 'sequelize'
import type { DataTypesStatic, Db } from '../types.ts'

export default (sequelize: Sequelize, DataTypes: DataTypesStatic) => {
  const Division = sequelize.define('Division', {
    divisionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    shortName: DataTypes.STRING,
    rank: DataTypes.INTEGER,
  }, {
    tableName: 'divisions',
    freezeTableName: true,
    timestamps: false,
  })
  ;(Division as any).associate = function (models: Db) {
    Division.hasMany(models.Team, {
      foreignKey: 'divisionId',
      as: 'teams',
    })
  }
  return Division
}
