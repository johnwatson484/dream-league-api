module.exports = (sequelize, DataTypes) => {
  return sequelize.define('History', {
    historyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    year: DataTypes.INTEGER,
    teams: DataTypes.INTEGER,
    league1: DataTypes.STRING,
    league2: DataTypes.STRING,
    cup: DataTypes.STRING,
    leagueCup: DataTypes.STRING,
    plate: DataTypes.STRING
  }, {
    tableName: 'history',
    freezeTableName: true,
    timestamps: false
  })
}
