import Middleware from '../utils/middleware'
import { amqpConsumer, createChannel, createQueues } from './amqp'
import { wsConsumer } from './ws'

import User from '../model/User'

const onConnection = new Middleware()

// Gets user info from req object (provided by auth middleware)
// and puts it in the props scope
const extractUserInfo = (props, next) => {
  const { req } = props
  User.findById(req.userId)
    .then(user => {
      props.user = user
      next()
    })
    .catch(() => {
      console.warn('User not registered')
    })
}

const extractUserRooms = (props, next) => {
  props.user.findRooms().then(rooms => {
    props.user.rooms = rooms
    next()
  })
}

onConnection.use(extractUserInfo, extractUserRooms)

onConnection.use(createChannel, createQueues)

const amqpConsumerCallback = ({ ws, channel }, message) => {
  ws.send(message.content.toString())
  channel.ack(message)
}
onConnection.use(amqpConsumer(amqpConsumerCallback))

// WS Consume Messages
const wsConsumerCallback = ({ channel, user }, messageEnvelope) => {
  const { room, message } = JSON.parse(messageEnvelope)
  console.log(`Received message => ${message}`)
  channel.publish(
    'event',
    `room.${room}.new_message`,
    Buffer.from(JSON.stringify({ room, message, from: user.name }))
  )
}
onConnection.use(wsConsumer(wsConsumerCallback))

// Sets On Close callback
const wsOnClose = ({ ws, channel }, next) => {
  ws.on('close', () => {
    console.log('Connection closed')
    channel.close()
  })
  next()
}

// Sets On Error Callback
const wsOnError = ({ ws, channel }, next) => {
  ws.on('error', error => {
    console.warn(`Error: ${error}`)
    channel.close()
    ws.close()
  })
  next()
}
onConnection.use(wsOnClose, wsOnError)

// Function structure needed by WebSocket on('connection')
export default extras => (ws, req) => {
  onConnection.go({ ws, req, ...extras }, ({ ws, user }) =>
    ws.send(
      JSON.stringify({
        room: 'server',
        message: `Wellcome @${user.name} to => ${user.rooms.map(
          room => room._id
        )}`,
      })
    )
  )
}
