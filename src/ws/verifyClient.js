import { verifyToken } from '../auth/jwt'
import Middleware from '../utils/middleware'

const verifyClient = new Middleware()

function* userGenerator() {
  while (true) {
    yield 'Mike'
    yield 'Tom'
    yield 'Hannah'
    yield 'Peter'
    yield 'Lucas'
    yield 'Gloria'
    yield 'Ember'
    yield 'Nei'
  }
}
function* roomGenerator() {
  while (true) {
    yield 'room.football'
    yield 'room.music'
    yield 'room.dev'
  }
}

const users = userGenerator()
const rooms = roomGenerator()
const setFixUser = ({ req }, next) => {
  console.log('Authenticating')
  req.user = {
    id: users.next().value,
    rooms: ['room.main', rooms.next().value],
  }
  next()
}
verifyClient.use(setFixUser)

// const forbidAll = ({ done }) => {
//   done(false, 403, 'No user authentication')
// }
// verifyClient.use(forbidAll)

const decodeJWT = (props, next) => {
  const { req, ws } = props
  const token = req.headers['Authorization']
    ? req.headers['Authorization'].substring(7)
    : undefined
  if (token) {
    verifyToken(token, (err, decoded) => {
      if (err) {
        //invalid
      } else {
        // if everything is good, save to request for use in other routes
        req.user = decoded
        next()
      }
    })
  } else {
    console.log('No credentials')
    ws.send('No credentials')
    ws.close()
  }
}

// Function structure needed by WebSocket.Server
export default ({ req }, done) => {
  verifyClient.go({ req, done }, () => {
    done(true)
  })
}
