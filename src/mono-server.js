import http from 'http'

import app from './http/app'
import { createWSServer } from './ws/app'

import mdbPromise from './config/mdb'
import amqpPromise from './config/amqp'

Promise.all([mdbPromise, amqpPromise])
  .then(([mdb_conn, amqp_conn]) => {
    app.set('mdb_connection', mdb_conn)
    app.set('amqp_connection', amqp_conn)

    const server = http.createServer(app)
    createWSServer(server, mdb_conn, amqp_conn)

    const server_port = process.env.SERVER_PORT

    server.listen(server_port || 3000, () => {
      console.log(`Server started on port ${server.address().port}`)
    })
  })
  .catch(() => {
    console.warn('Error connecting to Mongo DB or Rabbit.')
  })
