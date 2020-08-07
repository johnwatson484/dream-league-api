module.exports = (sequelize, DataTypes) => {
  const Division = sequelize.define('Division', {
    divisionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    rank: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    tableName: 'divisions',
    freezeTableName: true
  })
  Division.associate = function (models) {
    Division.hasMany(models.Team, {
      foreignKey: 'divisionId',
      as: 'teams'
    })
  }
  return Division
}
