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
    freezeTableName: true,
    timestamps: false
  })
  Team.associate = function (models) {
    Team.belongsTo(models.Division, {
      foreignKey: 'divisionId',
      as: 'division'
    })
    Team.hasMany(models.Player, {
      foreignKey: 'teamId',
      as: 'players'
    })
    Team.belongsToMany(models.Manager, {
      through: 'managerKeepers',
      foreignKey: 'teamId',
      as: 'managers',
      onDelete: 'CASCADE'
    })
    Team.hasMany(models.Concede, {
      foreignKey: 'teamId',
      as: 'conceded'
    })
  }
  return Team
}
