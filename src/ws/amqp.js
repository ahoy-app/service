import amqp from '../config/amqp'

// A Middleware that creates an AMQP channel
export const createChannel = (props, next) =>
  amqp.then(connection => {
    //When connection is ready, creeate a channel
    connection.createChannel().then(channel => {
      props.channel = channel
      next()
    })
  })

export const createQueues = (props, next) => {
  const { user, channel } = props // TODO: Fix this coupling
  Promise.all([
    channel.assertExchange('room', 'topic', { durable: true }),
    channel.assertQueue('', { exclusive: true, autoDelete: true }),
  ])
    .then(([, q]) => {
      Promise.all[
        user.rooms.map(room =>
          channel.bindQueue(q.queue, 'room', `room.${room._id}`)
        )
      ]
    })
    .then(next)
}

// Curring a middleware with a callback onMessage
// onMessageCallback will receive props and message
export const amqpConsumer = onMessageCallback => (props, next) => {
  const { channel } = props
  channel.consume('', message => {
    //Whenn AMQP message arrives
    if (message) {
      onMessageCallback(props, message)
    } else {
      console.error('Consumer closed by Rabbit')
    }
  })
  next()
}
