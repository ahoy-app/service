// A Middleware that creates an AMQP channel
export const createChannel = (props, next) => {
  const { amqp } = props
  amqp.createChannel().then(channel => {
    props.channel = channel
    next()
  })
}

export const createDispatch = (props, next) => {
  const { channel } = props
  props.dispatch = ({ key, body }) => {
    channel.publish('event', key, Buffer.from(JSON.stringify(body)))
    console.log({ key, body })
  }
  next()
}

export const createQueues = (props, next) => {
  const { user, channel } = props // TODO: Fix this coupling
  channel
    .assertQueue('', { exclusive: true, autoDelete: true })
    .then(q => {
      props.queue = q.queue
      return Promise.all(
        user.rooms.map(room =>
          channel.bindQueue(q.queue, 'event', `room.${room._id}.#`)
        )
      )
    })
    .then(() => {
      channel.bindQueue(props.queue, 'event', `user.${user._id}.#`)
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
