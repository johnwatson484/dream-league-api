module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    teamId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    divisionId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    alias: DataTypes.STRING
  }, {
    tableName: 'teams',
    freezeTableName: true
  })
  Team.associate = function (models) {
    Team.belongsTo(models.Division, {
      foreignKey: 'divisionId'
    })
    Team.hasMany(models.Player, {
      foreignKey: 'teamId',
      as: 'players'
    })
  }
  return Team
}
