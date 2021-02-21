module.exports = (sequelize, DataTypes) => {
  const Summary = sequelize.define('Summary', {
    gameweekId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    summary: DataTypes.JSON
  }, {
    tableName: 'summaries',
    freezeTableName: true,
    timestamps: false
  })
  Summary.associate = function (models) {
    Summary.belongsTo(models.Gameweek, {
      foreignKey: 'gameweekId',
      as: 'gameweek'
    })
  }
  return Summary
}
