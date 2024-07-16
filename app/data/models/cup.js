module.exports = (sequelize, DataTypes) => {
  const Cup = sequelize.define('Cup', {
    cupId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    hasGroupStage: DataTypes.BOOLEAN,
    knockoutLegs: DataTypes.INTEGER,
  }, {
    tableName: 'cups',
    freezeTableName: true,
    timestamps: false,
  })
  Cup.associate = function (models) {
    Cup.hasMany(models.Group, {
      foreignKey: 'cupId',
      as: 'groups',
    })
    Cup.hasMany(models.Fixture, {
      foreignKey: 'cupId',
      as: 'fixtures',
    })
  }
  return Cup
}
