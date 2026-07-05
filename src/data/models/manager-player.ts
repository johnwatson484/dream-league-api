import type { Sequelize } from 'sequelize'
import type { DataTypesStatic, Db } from '../types.ts'

export default function defineManagerPlayerModel (sequelize: Sequelize, DataTypes: DataTypesStatic) {
  const ManagerPlayer = sequelize.define('ManagerPlayer', {
    managerId: { type: DataTypes.INTEGER, primaryKey: true },
    playerId: { type: DataTypes.INTEGER, primaryKey: true },
    substitute: DataTypes.BOOLEAN,
  }, {
    tableName: 'managerPlayers',
    freezeTableName: true,
    timestamps: false,
  })
  ;(ManagerPlayer as any).associate = function (models: Db) {
    ManagerPlayer.belongsTo(models.Manager, { foreignKey: 'managerId' })
    ManagerPlayer.belongsTo(models.Player, { foreignKey: 'playerId' })
  }
  return ManagerPlayer
}
