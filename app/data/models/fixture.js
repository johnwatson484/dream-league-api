module.exports = (sequelize, DataTypes) => {
  const Fixture = sequelize.define('Fixture', {
    fixtureId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cupId: DataTypes.INTEGER,
    gameweekId: DataTypes.INTEGER,
    homeManagerId: DataTypes.INTEGER,
    awayManagerId: DataTypes.INTEGER,
    round: DataTypes.INTEGER
  }, {
    tableName: 'fixtures',
    freezeTableName: true,
    timestamps: false
  })
  Fixture.associate = function (models) {
    Fixture.belongsTo(models.Cup, {
      foreignKey: 'cupId',
      as: 'cup'
    })
    Fixture.belongsTo(models.Gameweek, {
      foreignKey: 'gameweekId',
      as: 'gameweek'
    })
    Fixture.belongsTo(models.Manager, {
      foreignKey: 'homeManagerId',
      as: 'homeManager'
    })
    Fixture.belongsTo(models.Manager, {
      foreignKey: 'awayManagerId',
      as: 'awayManager'
    })
  }
  return Fixture
}
