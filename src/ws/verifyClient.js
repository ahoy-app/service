import { verifyToken } from '../auth/jwt'
import Middleware from '../utils/middleware'
import { URL } from 'url'

const verifyClient = new Middleware()

const getRoom = user => {
  switch (user) {
    case 'mike':
      return ['room.main', 'room.dev', 'room.hannah-mike']
    case 'tom':
      return ['room.main', 'room.dev', 'room.dea']
    case 'hannah':
      return ['room.main', 'room.dev', 'room.hannah-mike']
  }
}

const decodeJWT = (props, next) => {
  const { req, done } = props
  const url = new URL(req.url, 'ws://location/')
  const token = url.searchParams.get('token')
  if (token) {
    verifyToken(token, (err, decoded) => {
      if (err) {
        done(false, 403, 'No user authentication')
      } else {
        // if everything is good, save to request for use in other routes
        const { user: name } = decoded
        req.user = { name, rooms: getRoom(name) }
        next()
      }
    })
  } else {
    done(false, 403, 'No user authentication')
  }
}

verifyClient.use(decodeJWT)

// Function structure needed by WebSocket.Server
export default ({ req }, done) => {
  verifyClient.go({ req, done }, () => {
    done(true)
  })
}
