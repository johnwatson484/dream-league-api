'use strict'
module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define('Player', {
    playerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    teamId: DataTypes.INTEGER,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    alias: DataTypes.STRING,
    position: DataTypes.STRING
  }, {
    tableName: 'players',
    freezeTableName: true
  })
  Player.associate = function (models) {
    Player.belongsTo(models.Team, {
      foreignKey: 'teamId'
    })
  }
  return Player
}
