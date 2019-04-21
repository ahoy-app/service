import { URL } from 'url'

import verifyClient from '../auth/verifyClient'

// Function structure needed by WebSocket.Server
export default ({ req }, done) => {
  const url = new URL(req.url, 'ws://location/')
  const token = url.searchParams.get('token')

  verifyClient(req, token, success => {
    if (success) {
      done(true)
    } else {
      done(false, 403, 'No user authentication')
    }
  })
}
