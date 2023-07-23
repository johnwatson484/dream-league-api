const amqp = require('amqplib')
const { message } = require('../config')
let connection
let channel

const start = async (aircraft) => {
  const { host, port, username, password, scoreExchange, scoreQueue } = message
  connection = await amqp.connect(`amqp://${username}:${password}@${host}:${port}`)
  channel = await connection.createChannel()
  await channel.assertExchange(scoreExchange, 'fanout', {
    durable: true
  })

  const q = await channel.assertQueue(scoreQueue)

  await channel.bindQueue(q.queue, scoreExchange, '')
  console.log('Waiting for score updates')

  await channel.consume(q.queue, async function (msg) {
    if (msg.content) {
      const body = JSON.parse(msg.content.toString())
      console.log('Score received:', body)
    }
  }, {
    noAck: true
  })
}

const stop = async () => {
  await channel.close()
  await connection.close()
}

module.exports = {
  start,
  stop
}
