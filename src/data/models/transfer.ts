import type { Sequelize } from 'sequelize'
import type { DataTypesStatic, Db } from '../types.ts'

export default function defineTransferModel (sequelize: Sequelize, DataTypes: DataTypesStatic) {
  const Transfer = sequelize.define('Transfer', {
    transferId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    managerId: DataTypes.INTEGER,
    playerInId: DataTypes.INTEGER,
    playerOutId: { type: DataTypes.INTEGER, allowNull: true },
    meetingId: { type: DataTypes.INTEGER, allowNull: true },
    type: DataTypes.STRING,
    created: DataTypes.DATE,
  }, {
    tableName: 'transfers',
    freezeTableName: true,
    timestamps: false,
  })
  ;(Transfer as any).associate = function (models: Db) {
    Transfer.belongsTo(models.Manager, {
      foreignKey: 'managerId',
      as: 'manager',
    })
    Transfer.belongsTo(models.Player, {
      foreignKey: 'playerInId',
      as: 'playerIn',
    })
    Transfer.belongsTo(models.Player, {
      foreignKey: 'playerOutId',
      as: 'playerOut',
    })
    Transfer.belongsTo(models.Meeting, {
      foreignKey: 'meetingId',
      as: 'meeting',
    })
  }
  return Transfer
}
