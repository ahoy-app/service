import http from 'http'

import app from './http/app'
import { createWSServer } from './ws/app'

const server = http.createServer(app)
createWSServer(server)

const server_port = process.env.SERVER_PORT

server.listen(server_port || 3000, () => {
  console.log(`Server started on port ${server.address().port}`)
})
