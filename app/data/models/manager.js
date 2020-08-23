module.exports = (sequelize, DataTypes) => {
  const Manager = sequelize.define('Manager', {
    managerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING
  }, {
    tableName: 'managers',
    freezeTableName: true,
    timestamps: false
  })
  return Manager
}
