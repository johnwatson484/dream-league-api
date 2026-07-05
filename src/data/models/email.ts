import type { Sequelize } from 'sequelize'
import type { DataTypesStatic, Db } from '../types.ts'

export default function defineEmailModel (sequelize: Sequelize, DataTypes: DataTypesStatic) {
  const Email = sequelize.define('Email', {
    emailId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    managerId: DataTypes.INTEGER,
    address: DataTypes.STRING,
  }, {
    tableName: 'emails',
    freezeTableName: true,
    timestamps: false,
  })
  ;(Email as any).associate = function (models: Db) {
    Email.belongsTo(models.Manager, {
      foreignKey: 'managerId',
      as: 'manager',
    })
  }
  return Email
}
