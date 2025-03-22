const fs = require('fs')
const path = require('path')
const { Client } = require('pg')

async function loadSqlFiles (folderPath, dbConfig) {
  const client = new Client(dbConfig)

  try {
    await client.connect()

    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.sql'))

    for (const file of files) {
      const filePath = path.join(folderPath, file)

      const sql = fs.readFileSync(filePath, 'utf8')

      console.log(`Executing ${file}...`)
      await client.query(sql)
      console.log(`${file} executed successfully.`)
    }
  } catch (error) {
    console.error('Error executing SQL files:', error)
  } finally {
    await client.end()
  }
}

const folderPath = path.join(__dirname, 'sql', 'local')
const dbConfig = {
  host: 'localhost',
  database: 'dream_league_api',
  user: 'postgres',
  password: 'postgres',
  port: 5432,
}

loadSqlFiles(folderPath, dbConfig).then(() => {
  console.log('All SQL files executed.')
})
