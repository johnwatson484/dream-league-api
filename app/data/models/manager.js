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
    Manager.hasMany(models.Goal, {
      foreignKey: 'managerId',
      as: 'goals'
    })
    Manager.hasMany(models.Concede, {
      foreignKey: 'managerId',
      as: 'conceded'
    })
    Manager.belongsToMany(models.Group, {
      through: 'managerGroups',
      foreignKey: 'managerId',
      as: 'groups',
      onDelete: 'CASCADE'
    })
  }
  return Manager
}
