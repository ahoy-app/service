import Middleware from '../utils/middleware'
import createChannel from './amqp'
import userInfo from './users'

const onConnection = new Middleware()

// AMQP Channel middleware
const createQueues = (props, next) => {
  const { rooms, channel } = props
  Promise.all([
    channel.assertExchange('room', 'topic', { durable: true }),
    channel
      .assertQueue('', { exclusive: true, autoDelete: true })
      .then(q => rooms.map(room => channel.bindQueue(q.queue, 'room', room))),
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
  ws.on('message', message => {
    console.log(`Received message => ${message}`)
    channel.publish('room', 'room.main', Buffer.from(message))
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

onConnection.use(userInfo, createChannel, createQueues)

onConnection.use(amqpConsumer)
onConnection.use(wsConsumer)
onConnection.use(wsOnClose, wsOnError)

export default (ws, req) => {
  onConnection.go({ ws, req }, ({ ws, ip }) => ws.send(`Wellcome ${ip}`))
}
