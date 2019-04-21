import { verifyToken } from '../auth/jwt'
import Middleware from '../utils/middleware'

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
  const { req, token, done } = props

  if (token) {
    verifyToken(token, (err, decoded) => {
      if (err) {
        done(false)
      } else {
        // if everything is good, save to request for use in other routes
        const { user: name } = decoded
        req.user = { name, rooms: getRoom(name) }
        next(true)
      }
    })
  } else {
    done(false)
  }
}

verifyClient.use(decodeJWT)

export default (req, token, done) =>
  verifyClient.go({ req, token, done }, () => {
    done(true)
  })
