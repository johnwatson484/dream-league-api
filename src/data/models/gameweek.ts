import type { Sequelize } from 'sequelize'
import type { DataTypesStatic, Db } from '../types.ts'

export default (sequelize: Sequelize, DataTypes: DataTypesStatic) => {
  const Gameweek = sequelize.define('Gameweek', {
    gameweekId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    startDate: DataTypes.DATE,
    endDate: {
      type: DataTypes.VIRTUAL,
      get (this: any) {
        const endDate = new Date(this.startDate)
        endDate.setDate(endDate.getDate() + 6)
        return endDate
      },
    },
    isActive: {
      type: DataTypes.VIRTUAL,
      get (this: any) {
        const currentDate = new Date()
        return currentDate >= this.startDate
      },
    },
    shortDate: {
      type: DataTypes.VIRTUAL,
      get (this: any) {
        return new Date(this.startDate).toLocaleDateString('en-GB')
      },
    },
  }, {
    tableName: 'gameweeks',
    freezeTableName: true,
    timestamps: false,
  })
  ;(Gameweek as any).associate = function (models: Db) {
    Gameweek.hasMany(models.Goal, {
      foreignKey: 'gameweekId',
      as: 'goals',
    })
    Gameweek.hasMany(models.Concede, {
      foreignKey: 'gameweekId',
      as: 'conceded',
    })
    Gameweek.hasOne(models.Summary, {
      foreignKey: 'gameweekId',
      as: 'summary',
    })
  }
  return Gameweek
}
