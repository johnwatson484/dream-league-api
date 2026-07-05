import type { Sequelize } from 'sequelize'
import type { DataTypesStatic, Db } from '../types.ts'

export default (sequelize: Sequelize, DataTypes: DataTypesStatic) => {
  const Player = sequelize.define('Player', {
    playerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    teamId: DataTypes.INTEGER,
    position: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    alias: DataTypes.STRING,
    fullName: {
      type: DataTypes.VIRTUAL,
      get (this: any) {
        return `${this.firstName} ${this.lastName}`.trim()
      },
    },
    lastNameFirstName: {
      type: DataTypes.VIRTUAL,
      get (this: any) {
        if (this.hasFirstName) {
          return `${this.lastName}, ${this.firstName}`.trim()
        }
        return this.lastName
      },
    },
    lastNameInitial: {
      type: DataTypes.VIRTUAL,
      get (this: any) {
        if (this.hasFirstName) {
          return `${this.lastName}, ${this.firstName[0]}`.trim()
        }
        return this.lastName
      },
    },
    hasFirstName: {
      type: DataTypes.VIRTUAL,
      get (this: any) {
        return this.firstName != null
      },
    },
  }, {
    tableName: 'players',
    freezeTableName: true,
    timestamps: false,
  })
  ;(Player as any).associate = function (models: Db) {
    Player.belongsTo(models.Team, {
      foreignKey: 'teamId',
      as: 'team',
    })
    Player.belongsToMany(models.Manager, {
      through: 'managerPlayers',
      foreignKey: 'playerId',
      as: 'managers',
      onDelete: 'CASCADE',
    })
    Player.hasMany(models.Goal, {
      foreignKey: 'playerId',
      as: 'goals',
    })
  }
  return Player
}
