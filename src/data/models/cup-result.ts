import type { Sequelize } from 'sequelize'
import type { DataTypesStatic, Db } from '../types.ts'

export default function defineCupResultModel (sequelize: Sequelize, DataTypes: DataTypesStatic) {
  const CupResult = sequelize.define('CupResult', {
    cupResultId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fixtureId: DataTypes.INTEGER,
    winnerManagerId: { type: DataTypes.INTEGER, allowNull: true },
    homeAggregate: { type: DataTypes.INTEGER, defaultValue: 0 },
    awayAggregate: { type: DataTypes.INTEGER, defaultValue: 0 },
    decidedBy: { type: DataTypes.STRING, allowNull: true },
  }, {
    tableName: 'cupResults',
    freezeTableName: true,
    timestamps: false,
  })
  ;(CupResult as any).associate = function (models: Db) {
    CupResult.belongsTo(models.Fixture, {
      foreignKey: 'fixtureId',
      as: 'fixture',
    })
    CupResult.belongsTo(models.Manager, {
      foreignKey: 'winnerManagerId',
      as: 'winner',
    })
  }
  return CupResult
}
