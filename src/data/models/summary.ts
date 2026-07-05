import type { Sequelize } from 'sequelize'
import type { DataTypesStatic, Db } from '../types.ts'

export default (sequelize: Sequelize, DataTypes: DataTypesStatic) => {
  const Summary = sequelize.define('Summary', {
    gameweekId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    summary: DataTypes.JSON,
  }, {
    tableName: 'summaries',
    freezeTableName: true,
    timestamps: false,
  })
  ;(Summary as any).associate = function (models: Db) {
    Summary.belongsTo(models.Gameweek, {
      foreignKey: 'gameweekId',
      as: 'gameweek',
    })
  }
  return Summary
}
