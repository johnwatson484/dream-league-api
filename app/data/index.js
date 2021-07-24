const fs = require('fs')
const path = require('path')
const { Sequelize, DataTypes } = require('sequelize')
const modelPath = path.join(__dirname, 'models')
const config = require('../config').database
const db = {}

const sequelize = new Sequelize(config.database, config.username, config.password, config)

fs.readdirSync(modelPath)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    const model = require(path.join(modelPath, file))(sequelize, DataTypes)
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
