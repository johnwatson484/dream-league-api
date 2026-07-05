import type { Sequelize } from 'sequelize'
import type { DataTypesStatic, Db } from '../types.ts'

export default (sequelize: Sequelize, DataTypes: DataTypesStatic) => {
  const ManagerKeeper = sequelize.define('ManagerKeeper', {
    managerId: { type: DataTypes.INTEGER, primaryKey: true },
    teamId: { type: DataTypes.INTEGER, primaryKey: true },
    substitute: DataTypes.BOOLEAN,
  }, {
    tableName: 'managerKeepers',
    freezeTableName: true,
    timestamps: false,
  })
  ;(ManagerKeeper as any).associate = function (models: Db) {
    ManagerKeeper.belongsTo(models.Manager, { foreignKey: 'managerId' })
    ManagerKeeper.belongsTo(models.Team, { foreignKey: 'teamId' })
  }
  return ManagerKeeper
}
