const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
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
        return moment(this.startDate).format('DD[/]MM[/]YYYY HH:mm')
      },
    },
  }, {
    tableName: 'meetings',
    freezeTableName: true,
    timestamps: false,
  })
}
