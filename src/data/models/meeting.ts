import type { Sequelize } from 'sequelize'
import type { DataTypesStatic } from '../types.ts'

export default (sequelize: Sequelize, DataTypes: DataTypesStatic) => {
  return sequelize.define('Meeting', {
    meetingId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: DataTypes.DATE,
    shortDate: {
      type: DataTypes.VIRTUAL,
      get (this: any) {
        return new Date(this.startDate).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })
      },
    },
  }, {
    tableName: 'meetings',
    freezeTableName: true,
    timestamps: false,
  })
}
