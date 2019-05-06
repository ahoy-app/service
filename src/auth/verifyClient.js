import { verifyToken } from '../auth/jwt'
import Middleware from '../utils/middleware'

const verifyClient = new Middleware()

const decodeJWT = (props, next) => {
  const { req, token, done } = props

  if (token) {
    verifyToken(token, (err, decoded) => {
      if (err) {
        console.warn('Invalid Token')
        done(false)
      } else {
        if (decoded.user) {
          req.userId = decoded.user
          req.admin = decoded.admin ? true : false
          next()
        } else {
          done(false)
        }
      }
    })
  } else {
    console.warn('No token provided')
    done(false)
  }
}

verifyClient.use(decodeJWT)

export default (req, token, done) =>
  verifyClient.go({ req, token, done }, () => {
    done(true)
  })
