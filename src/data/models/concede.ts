import type { Sequelize } from 'sequelize'
import type { DataTypesStatic, Db } from '../types.ts'

export default (sequelize: Sequelize, DataTypes: DataTypesStatic) => {
  const Concede = sequelize.define('Concede', {
    concedeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    teamId: DataTypes.INTEGER,
    gameweekId: DataTypes.INTEGER,
    managerId: DataTypes.INTEGER,
    cup: DataTypes.BOOLEAN,
    created: DataTypes.DATE,
    createdBy: DataTypes.STRING,
  }, {
    tableName: 'conceded',
    freezeTableName: true,
    timestamps: false,
  })
  ;(Concede as any).associate = function (models: Db) {
    Concede.belongsTo(models.Team, {
      foreignKey: 'teamId',
      as: 'team',
    })
    Concede.belongsTo(models.Manager, {
      foreignKey: 'managerId',
      as: 'manager',
    })
    Concede.belongsTo(models.Gameweek, {
      foreignKey: 'gameweekId',
      as: 'gameweek',
    })
  }
  return Concede
}
