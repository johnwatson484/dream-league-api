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
  return Summary
}
