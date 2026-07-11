import { pino } from 'pino'
import config from './config/index.ts'

const logger = pino({
  level: config.get('logLevel'),
})

export default logger
