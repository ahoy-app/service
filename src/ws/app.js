import WebSocket from 'ws'

import onConnection from './onConnection'
import verifyClient from './verifyClient'

export const createWSServer = server => {
  const wss = new WebSocket.Server({
    server,
    path: '/ws',
    verifyClient: verifyClient,
  })
  wss.on('connection', onConnection)
}
