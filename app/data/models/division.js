module.exports = (sequelize, DataTypes) => {
  const Division = sequelize.define('Division', {
    divisionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    shortName: DataTypes.STRING,
    rank: DataTypes.INTEGER
  }, {
    tableName: 'divisions',
    freezeTableName: true,
    timestamps: false
  })
  Division.associate = function (models) {
    Division.hasMany(models.Team, {
      foreignKey: 'divisionId',
      as: 'teams'
    })
  }
  return Division
}
