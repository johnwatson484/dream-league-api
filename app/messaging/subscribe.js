const amqp = require('amqplib')
const { message } = require('../config')
const { updateLiveScores } = require('../live-scores')
let connection
let channel

const start = async () => {
  try {
    const { host, port, username, password, scoreExchange, scoreQueue } = message
    connection = await amqp.connect(`amqp://${username}:${password}@${host}:${port}`)
    channel = await connection.createChannel()
    await channel.assertExchange(scoreExchange, 'fanout', {
      durable: true,
    })

    const q = await channel.assertQueue(scoreQueue)

    await channel.bindQueue(q.queue, scoreExchange, '')
    console.log('Waiting for score updates')

    await channel.consume(q.queue, updateLiveScores, {
      noAck: true,
    })
  } catch (error) {
    console.error(error)
    if (channel) {
      await channel.close()
    }
    if (connection) {
      await connection.close
    }
    await new Promise(resolve => setTimeout(resolve, 30000))
    await start()
  }
}

const stop = async () => {
  await channel.close()
  await connection.close()
}

module.exports = {
  start,
  stop,
}
