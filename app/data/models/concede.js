module.exports = (sequelize, DataTypes) => {
  const Concede = sequelize.define('Concede', {
    concedeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    teamId: DataTypes.INTEGER,
    gameweekId: DataTypes.INTEGER,
    managerId: DataTypes.INTEGER,
    cup: DataTypes.BOOLEAN,
    created: DataTypes.DATE,
    createdBy: DataTypes.STRING
  }, {
    tableName: 'conceded',
    freezeTableName: true,
    timestamps: false
  })
  Concede.associate = function (models) {
    Concede.belongsTo(models.Team, {
      foreignKey: 'teamId',
      as: 'team'
    })
    Concede.belongsTo(models.Manager, {
      foreignKey: 'managerId',
      as: 'manager'
    })
    Concede.belongsTo(models.Gameweek, {
      foreignKey: 'gameweekId',
      as: 'gameweek'
    })
  }
  return Concede
}
