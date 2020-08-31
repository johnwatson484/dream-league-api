module.exports = (sequelize, DataTypes) => {
  const Teamsheet = sequelize.define('Teamsheet', {
    teamsheetId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    managerId: DataTypes.INTEGER,
    player: DataTypes.STRING,
    position: DataTypes.STRING,
    substitute: DataTypes.BOOLEAN,
    bestMatchId: DataTypes.INTEGER,
    distance: DataTypes.INTEGER
  }, {
    tableName: 'teamsheet',
    freezeTableName: true,
    timestamps: false
  })
  Teamsheet.associate = function (models) {
    Teamsheet.belongsTo(models.Manager, {
      foreignKey: 'managerId',
      as: 'manager'
    })
  }
  return Teamsheet
}
