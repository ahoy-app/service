import Middleware from '../utils/middleware'
import {
  amqpConsumer,
  createChannel,
  createDispatch,
  createQueues,
} from './amqp'
import { wsConsumer } from './ws'
import { new_message } from '../events/message'
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

onConnection.use(createChannel, createDispatch, createQueues)

const amqpConsumerCallback = ({ ws, channel, queue }, message) => {
  const key = message.fields.routingKey
  const body = JSON.parse(message.content.toString())
  console.log('QUEUE:', queue)
  if (key.match(/user\.[^.]*\.invited/)) {
    channel.bindQueue(queue, 'event', `room.${body.id}.#`).then(() => {
      console.log('AAAAAAAAAAAA')
      ws.send(JSON.stringify({ key, body }))
      channel.ack(message)
    })
  } else if (key.match(/user\.[^.]*\.kicked/)) {
    channel.unbindQueue(queue, 'event', `room.${body.id}.#`).then(() => {
      console.log('AAAAAAAAAAAA')
      ws.send(JSON.stringify({ key, body }))
      channel.ack(message)
    })
  } else {
    ws.send(JSON.stringify({ key, body }))
    channel.ack(message)
  }
}
onConnection.use(amqpConsumer(amqpConsumerCallback))

// WS Consume Messages
const wsConsumerCallback = ({ dispatch, user }, messageEnvelope) => {
  const { room, message } = JSON.parse(messageEnvelope)
  console.log(`Received message => ${message}`)
  dispatch(
    new_message({
      id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      from: user._id,
      to: room,
      content: message,
      type: 'text',
    })
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
