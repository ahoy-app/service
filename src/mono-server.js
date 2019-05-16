import http from 'http'

import app from './http/app'
import { createWSServer } from './ws/app'

import mdb from './config/mdb'
import amqp from './config/amqp'

Promise.all([mdb(), amqp()])
  .then(([mdb_conn, amqp_conn]) => {
    app.set('mdb', mdb_conn)
    app.set('amqp', amqp_conn)

    const server = http.createServer(app)
    createWSServer(server, { mdb: mdb_conn, amqp: amqp_conn })

    const server_port = process.env.PORT || 8080

    server.listen(server_port, () => {
      console.log(`Server started on port ${server.address().port}`)
    })
  })
  .catch(error => {
    console.warn('Error connecting to Mongo DB or Rabbit.' + error)
    process.exit(1)
  })
