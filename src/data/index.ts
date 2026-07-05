import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { Sequelize, DataTypes, type Dialect } from 'sequelize'
import config from '../config/index.ts'
import type { Db } from './types.ts'

const db = {} as Db

const sequelize = new Sequelize(
  config.get('database.database'),
  config.get('database.username'),
  config.get('database.password'),
  {
    host: config.get('database.host'),
    port: config.get('database.port'),
    dialect: config.get('database.dialect') as Dialect,
    logging: config.get('database.logging'),
    define: {
      timestamps: false,
    },
  }
)

const modelPath = join(import.meta.dirname, 'models')

for (const file of readdirSync(modelPath).filter(f => !f.startsWith('.') && f !== 'index.ts' && f.endsWith('.ts'))) {
  const { default: modelFactory } = await import(pathToFileURL(join(modelPath, file)).href)
  const model = modelFactory(sequelize, DataTypes)
  ;(db as any)[model.name] = model
}

for (const modelName of Object.keys(db)) {
  const entry = (db as any)[modelName]
  if (entry.associate) {
    entry.associate(db)
  }
}

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
