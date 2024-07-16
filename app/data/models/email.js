module.exports = (sequelize, DataTypes) => {
  const Email = sequelize.define('Email', {
    emailId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    managerId: DataTypes.INTEGER,
    address: DataTypes.STRING,
  }, {
    tableName: 'emails',
    freezeTableName: true,
    timestamps: false,
  })
  Email.associate = function (models) {
    Email.belongsTo(models.Manager, {
      foreignKey: 'managerId',
      as: 'manager',
    })
  }
  return Email
}
