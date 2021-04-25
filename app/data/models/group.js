module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    groupId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cupId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    groupLegs: DataTypes.INTEGER,
    teamsAdvancing: DataTypes.INTEGER
  }, {
    tableName: 'groups',
    freezeTableName: true,
    timestamps: false
  })
  return Group
}
