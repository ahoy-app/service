import WebSocket from 'ws'

import onConnection from './onConnection'
import verifyWSConnection from './verifyWSConnection'

export const createWSServer = (server, extras) => {
  const wss = new WebSocket.Server({
    server,
    path: '/ws',
    verifyClient: verifyWSConnection,
  })
  wss.on('connection', onConnection(extras))
}
