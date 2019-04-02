import http from 'http'
import WebSocket from 'ws'

import app from './src/app'
import onConnection from './src/ws/onConnection'
import verifyClient from './src/ws/verifyClient'

const server = http.createServer(app)
const wss = new WebSocket.Server({
  server,
  path: '/ws',
  verifyClient: verifyClient,
})
wss.on('connection', onConnection)

const server_port = process.env.SERVER_PORT
server.listen(server_port || 3000, () => {
  console.log(`Server started on port ${server.address().port}`)
})
