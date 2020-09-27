module.exports = (sequelize, DataTypes) => {
  const Goal = sequelize.define('Goal', {
    goalId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    playerId: DataTypes.INTEGER,
    gameweekId: DataTypes.INTEGER,
    managerId: DataTypes.INTEGER,
    cup: DataTypes.BOOLEAN,
    created: DataTypes.DATE,
    createdBy: DataTypes.STRING
  }, {
    tableName: 'goals',
    freezeTableName: true,
    timestamps: false
  })
  Goal.associate = function (models) {
    Goal.belongsTo(models.Player, {
      foreignKey: 'playerId',
      as: 'player'
    })
    Goal.belongsTo(models.Manager, {
      foreignKey: 'managerId',
      as: 'manager'
    })
    Goal.belongsTo(models.Gameweek, {
      foreignKey: 'gameweekId',
      as: 'gameweek'
    })
  }
  return Goal
}
