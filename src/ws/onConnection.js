import Middleware from '../utils/middleware'
import createChannel from './amqp'

const onConnection = new Middleware()

const extractUserInfo = (props, next) => {
  const { req } = props
  props.user = req.user
  next()
}

// AMQP Channel middleware
const createQueues = (props, next) => {
  const { user, channel } = props
  Promise.all([
    channel.assertExchange('room', 'topic', { durable: true }),
    channel
      .assertQueue('', { exclusive: true, autoDelete: true })
      .then(q =>
        user.rooms.map(room => channel.bindQueue(q.queue, 'room', room))
      ),
  ]).then(next())
}

// AMQP Consume messages
const amqpConsumer = ({ ws, channel }, next) => {
  channel.consume('', message => {
    //Whenn AMQP message arrives
    if (message) {
      ws.send(message.content.toString())
      channel.ack(message)
    } else {
      console.error('Consume closed by Rabbit')
    }
  })
  next()
}

// WS Consume Messages
const wsConsumer = ({ ws, channel }, next) => {
  ws.on('message', messageEnvelope => {
    const { room, message } = JSON.parse(messageEnvelope)
    console.log(`Received message => ${message}`)
    channel.publish('room', `room.${room}`, Buffer.from(messageEnvelope))
  })
  next()
}

// WS On Close callback
const wsOnClose = ({ ws, channel }, next) => {
  ws.on('close', () => {
    console.log('Connection closed')
    channel.close()
  })
  next()
}

// WS On Error Callback
const wsOnError = ({ ws, channel }, next) => {
  ws.on('error', error => {
    console.warn(`Error: ${error}`)
    channel.close()
    ws.close()
  })
  next()
}

onConnection.use(extractUserInfo)

onConnection.use(createChannel, createQueues)

onConnection.use(({ req }, next) => {
  console.log(req.user)
  next()
})

onConnection.use(amqpConsumer)
onConnection.use(wsConsumer)
onConnection.use(wsOnClose, wsOnError)

export default (ws, req) => {
  onConnection.go({ ws, req }, ({ ws, user }) =>
    ws.send(
      JSON.stringify({
        room: 'server',
        message: `Wellcome ${user.id} to ${user.rooms.map(
          room => ' ' + room.substring(5)
        )}`,
      })
    )
  )
}
