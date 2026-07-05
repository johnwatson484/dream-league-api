import type { Sequelize } from 'sequelize'
import type { DataTypesStatic, Db } from '../types.ts'

export default function defineGoalModel (sequelize: Sequelize, DataTypes: DataTypesStatic) {
  const Goal = sequelize.define('Goal', {
    goalId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    playerId: DataTypes.INTEGER,
    gameweekId: DataTypes.INTEGER,
    managerId: DataTypes.INTEGER,
    cup: DataTypes.BOOLEAN,
    created: DataTypes.DATE,
    createdBy: DataTypes.STRING,
    matchTime: { type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'goals',
    freezeTableName: true,
    timestamps: false,
  })
  ;(Goal as any).associate = function (models: Db) {
    Goal.belongsTo(models.Player, {
      foreignKey: 'playerId',
      as: 'player',
    })
    Goal.belongsTo(models.Manager, {
      foreignKey: 'managerId',
      as: 'manager',
    })
    Goal.belongsTo(models.Gameweek, {
      foreignKey: 'gameweekId',
      as: 'gameweek',
    })
  }
  return Goal
}
