import type { Sequelize } from 'sequelize'
import type { DataTypesStatic, Db } from '../types.ts'

export default function defineTeamsheetModel (sequelize: Sequelize, DataTypes: DataTypesStatic) {
  const Teamsheet = sequelize.define('Teamsheet', {
    teamsheetId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    managerId: DataTypes.INTEGER,
    player: DataTypes.STRING,
    position: DataTypes.STRING,
    substitute: DataTypes.BOOLEAN,
    bestMatchId: DataTypes.INTEGER,
    distance: DataTypes.INTEGER,
  }, {
    tableName: 'teamsheet',
    freezeTableName: true,
    timestamps: false,
  })
  ;(Teamsheet as any).associate = function (models: Db) {
    Teamsheet.belongsTo(models.Manager, {
      foreignKey: 'managerId',
      as: 'manager',
    })
  }
  return Teamsheet
}
