const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const Gameweek = sequelize.define('Gameweek', {
    gameweekId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    startDate: DataTypes.DATE,
    endDate: {
      type: DataTypes.VIRTUAL,
      get () {
        const endDate = new Date(this.startDate)
        endDate.setDate(endDate.getDate() + 6)
        return endDate
      }
    },
    isActive: {
      type: DataTypes.VIRTUAL,
      get () {
        const currentDate = new Date()
        return currentDate >= this.startDate
      }
    },
    shortDate: {
      type: DataTypes.VIRTUAL,
      get () {
        return moment(this.startDate).format('DD[/]MM[/]YYYY')
      }
    }
  }, {
    tableName: 'gameweeks',
    freezeTableName: true,
    timestamps: false
  })
  Gameweek.associate = function (models) {
    Gameweek.hasMany(models.Goal, {
      foreignKey: 'gameweekId',
      as: 'goals'
    })
    Gameweek.hasMany(models.Concede, {
      foreignKey: 'gameweekId',
      as: 'conceded'
    })
    Gameweek.hasOne(models.Summary, {
      foreignKey: 'gameweekId',
      as: 'summary'
    })
  }
  return Gameweek
}
