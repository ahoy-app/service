// A Middleware that creates an AMQP channel
export const createChannel = (props, next) => {
  const { amqp } = props
  amqp.createChannel().then(channel => {
    props.channel = channel
    next()
  })
}

export const createQueues = (props, next) => {
  const { user, channel } = props // TODO: Fix this coupling
  channel.assertQueue('', { exclusive: true, autoDelete: true }).then(q =>
    Promise.all(
      user.rooms.map(room =>
        channel.bindQueue(q.queue, 'event', `room.${room._id}.new_message`)
      )
    )
      .then(() => {
        channel.bindQueue(q.queue, 'event', `user.${user._id}.#`)
      })
      .then(next)
  )
}

// Curring a middleware with a callback onMessage
// onMessageCallback will receive props and message
export const amqpConsumer = onMessageCallback => (props, next) => {
  const { channel } = props
  console.log('VVVVV')
  channel.consume('', message => {
    //Whenn AMQP message arrives
    console.log('AAAAAAAAA')
    if (message) {
      onMessageCallback(props, message)
    } else {
      console.error('Consumer closed by Rabbit')
    }
  })
  next()
}
