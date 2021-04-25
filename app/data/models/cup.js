module.exports = (sequelize, DataTypes) => {
  const Cup = sequelize.define('Cup', {
    cupId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    hasGroupStage: DataTypes.BOOLEAN,
    knockoutLegs: DataTypes.INTEGER,
    finalLegs: DataTypes.INTEGER
  }, {
    tableName: 'cups',
    freezeTableName: true,
    timestamps: false
  })
  return Cup
}
