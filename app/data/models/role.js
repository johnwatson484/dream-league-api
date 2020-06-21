module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('role', {
    roleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING
  }, {
    tableName: 'roles',
    freezeTableName: true,
    timestamps: false
  })
  Role.associate = function (models) {
    Role.belongsToMany(models.user, {
      through: 'userRole',
      foreignKey: 'roleId',
      as: 'users',
      onDelete: 'CASCADE'
    })
  }
  return Role
}
