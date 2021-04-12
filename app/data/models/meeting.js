module.exports = (sequelize, DataTypes) => {
  const Meeting = sequelize.define('Meeting', {
    meetingId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: DataTypes.DATE
  }, {
    tableName: 'meetings',
    freezeTableName: true,
    timestamps: false
  })
  return Meeting
}
