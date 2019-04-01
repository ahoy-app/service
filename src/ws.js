import createChannel from './amqp'

const onconnection = (ws, req) => {
  const ip = req.connection.remoteAddress
  console.log(`Conection opened from: ${ip}`)

  createChannel().then(channel => {
    //When channel is ready, assert queue and bind callbacks
    Promise.all([
      channel.assertExchange('room', 'topic', { durable: true }),
      channel
        .assertQueue('', { exclusive: true })
        .then(q => channel.bindQueue(q.queue, 'room', 'room.main')),
    ]).then(() => {
      channel.consume('', message => {
        //Whenn AMQP message arrives
        ws.send(message.content.toString())
        channel.ack(message)
      })
      ws.on('message', message => {
        console.log(`Received message => ${message}`)
        channel.publish('room', 'room.main', Buffer.from(message))
      })
      ws.send(`Wellcome ${ip}`)
    })
  })
}

export default onconnection
