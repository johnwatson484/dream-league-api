'use strict'
module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define('Player', {
    playerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    teamId: DataTypes.INTEGER,
    position: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    alias: DataTypes.STRING,
    fullName: {
      type: DataTypes.VIRTUAL,
      get () {
        return `${this.firstName} ${this.lastName}`.trim()
      }
    },
    lastNameFirstName: {
      type: DataTypes.VIRTUAL,
      get () {
        if (this.hasFirstName) {
          return `${this.lastName}, ${this.firstName}`.trim()
        }
        return this.lastName
      }
    },
    lastNameInitial: {
      type: DataTypes.VIRTUAL,
      get () {
        if (this.hasFirstName) {
          return `${this.lastName}, ${this.firstName[0]}`.trim()
        }
        return this.lastName
      }
    },
    hasFirstName: {
      type: DataTypes.VIRTUAL,
      get () {
        return this.firstName != null
      }
    }
  }, {
    tableName: 'players',
    freezeTableName: true,
    timestamps: false
  })
  Player.associate = function (models) {
    Player.belongsTo(models.Team, {
      foreignKey: 'teamId',
      as: 'team'
    })
  }
  return Player
}
