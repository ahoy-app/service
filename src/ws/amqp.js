import Rabbit from 'amqplib'
import dotenv from 'dotenv'

//Config
dotenv.config()
const amqp_host = process.env.AMQP_HOST
const amqp_port = process.env.AMQP_PORT
// const amqp_user = process.env.AMQP_USER
// const amqp_pass = process.env.AMQP_PASS

//Connect
const amqp = Rabbit.connect(`amqp://${amqp_host}:${amqp_port}`)

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
    channel
      .assertQueue('', { exclusive: true, autoDelete: true })
      .then(q =>
        user.rooms.map(room => channel.bindQueue(q.queue, 'room', room))
      ),
  ]).then(next())
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
