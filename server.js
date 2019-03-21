import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import WebSocket from 'ws'
import Rabbit from 'amqplib'

// Env variables
dotenv.config()

// Express
const app = express()
const server = http.createServer(app)

//RabbitMQ
const amqp_host = process.env.AMQP_HOST
const amqp_port = process.env.AMQP_PORT
// const amqp_user = process.env.AMQP_USER
// const amqp_pass = process.env.AMQP_PASS
const amqp = Rabbit.connect(`amqp://${amqp_host}:${amqp_port}`)

// Static files
app.use(express.static('public'))

//WebSocket
const wss = new WebSocket.Server({ server, path: '/ws' })
wss.on('connection', (ws, req) => {
  const ip = req.connection.remoteAddress
  console.log(`Conection opened from: ${ip}`)

  amqp
    .then(connection => {
      //When connection is ready, creeate a channel
      return connection.createChannel()
    })
    .then(channel => {
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
})

const server_port = process.env.SERVER_PORT
server.listen(server_port || 3000, () => {
  console.log(`Server started on port ${server.address().port}`)
})
