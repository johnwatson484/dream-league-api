module.exports = (sequelize, DataTypes) => {
  const Manager = sequelize.define('Manager', {
    managerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    alias: DataTypes.STRING
  }, {
    tableName: 'managers',
    freezeTableName: true,
    timestamps: false
  })
  Manager.associate = function (models) {
    Manager.belongsToMany(models.Player, {
      through: 'managerPlayers',
      foreignKey: 'managerId',
      as: 'players',
      onDelete: 'CASCADE'
    })
    Manager.belongsToMany(models.Team, {
      through: 'managerKeepers',
      foreignKey: 'managerId',
      as: 'keepers',
      onDelete: 'CASCADE'
    })
    Manager.hasMany(models.Teamsheet, {
      foreignKey: 'managerId',
      as: 'teamsheet'
    })
  }
  return Manager
}
