import type { Sequelize } from 'sequelize'
import type { DataTypesStatic, Db } from '../types.ts'

export default function defineGoalReportModel (sequelize: Sequelize, DataTypes: DataTypesStatic) {
  const GoalReport = sequelize.define('GoalReport', {
    goalReportId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    managerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gameweekId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    goals: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    goalsCup: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    submittedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reviewedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'goalReports',
    freezeTableName: true,
    timestamps: false,
  })
  ;(GoalReport as any).associate = function (models: Db) {
    GoalReport.belongsTo(models.Player, {
      foreignKey: 'playerId',
      as: 'player',
    })
    GoalReport.belongsTo(models.Manager, {
      foreignKey: 'managerId',
      as: 'manager',
    })
    GoalReport.belongsTo(models.Gameweek, {
      foreignKey: 'gameweekId',
      as: 'gameweek',
    })
  }
  return GoalReport
}
