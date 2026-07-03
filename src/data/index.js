import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { Sequelize, DataTypes } from 'sequelize'
import config from '../config/index.js'

const db = {}

const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  config.database
)

const modelPath = join(import.meta.dirname, 'models')

for (const file of readdirSync(modelPath).filter(f => !f.startsWith('.') && f !== 'index.js' && f.endsWith('.js'))) {
  const { default: modelFactory } = await import(pathToFileURL(join(modelPath, file)).href)
  const model = modelFactory(sequelize, DataTypes)
  db[model.name] = model
}

for (const modelName of Object.keys(db)) {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
}

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
