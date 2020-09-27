module.exports = (sequelize, DataTypes) => {
  const Gameweek = sequelize.define('Gameweek', {
    gameweekId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    startDate: DataTypes.DATE
  }, {
    tableName: 'gameweeks',
    freezeTableName: true,
    timestamps: false
  })
  Gameweek.associate = function (models) {
    Gameweek.hasMany(models.Goal, {
      foreignKey: 'gameweekId',
      as: 'goals'
    })
    Gameweek.hasMany(models.Concede, {
      foreignKey: 'gameweekId',
      as: 'conceded'
    })
  }
  return Gameweek
}
