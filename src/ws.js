import createChannel from './amqp'

class WSFramework {
  use(fn) {
    this.go = (stack => (val, _next) =>
      stack(val, () => {
        fn.apply(this, [val, _next.bind.apply(_next, [null, val])])
      }))(this.go)
  }

  go(val, _next) {
    _next.apply(this, val)
  }
}

const wsf = new WSFramework()

// Id middleware
const id_middleware = (props, next) => {
  const { req } = props
  props.ip = req.connection.remoteAddress
  props.rooms = ['room.main', 'room.football']
  console.log(`Connection created ${props.ip}`)
  next()
}

// AMQP Channel middleware
const amqp_channel_middleware = (props, next) => {
  const { rooms } = props
  createChannel().then(channel => {
    props.channel = channel
    Promise.all([
      channel.assertExchange('room', 'topic', { durable: true }),
      channel
        .assertQueue('', { exclusive: true, autoDelete: true })
        .then(q => rooms.map(room => channel.bindQueue(q.queue, 'room', room))),
    ]).then(next())
  })
}

// AMQP Consume messages
const amqp_consume_msg_middleware = ({ ws, channel }, next) => {
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
const ws_consume_msg_middleware = ({ ws, channel }, next) => {
  ws.on('message', message => {
    console.log(`Received message => ${message}`)
    channel.publish('room', 'room.main', Buffer.from(message))
  })
  next()
}

// WS Consume Messages
const ws_close_middleware = ({ ws, channel }, next) => {
  ws.on('close', () => {
    console.log('Connection closed')
    channel.close()
  })
  next()
}

// WS Consume Messages
const error_handle_middleware = ({ ws, channel }, next) => {
  ws.on('error', error => {
    console.warn(`Error: ${error}`)
    channel.close()
    ws.close()
  })
  next()
}

wsf.use(id_middleware)
wsf.use(amqp_channel_middleware)
wsf.use(amqp_consume_msg_middleware)
wsf.use(ws_consume_msg_middleware)
wsf.use(ws_close_middleware)
wsf.use(error_handle_middleware)

const onconnection = (ws, req) => {
  wsf.go({ ws, req }, ({ ws, ip }) => ws.send(`Wellcome ${ip}`))
}

export default onconnection
