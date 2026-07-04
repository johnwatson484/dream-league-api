export default (sequelize, DataTypes) => {
  return sequelize.define('Meeting', {
    meetingId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: DataTypes.DATE,
    shortDate: {
      type: DataTypes.VIRTUAL,
      get () {
        return new Date(this.startDate).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })
      },
    },
  }, {
    tableName: 'meetings',
    freezeTableName: true,
    timestamps: false,
  })
}
