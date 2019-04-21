import verifyClient from '../../auth/verifyClient'

const getToken = req => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[1]
  } else if (req.query && req.query.token) {
    return req.query.token
  }
}

// Function structure needed by WebSocket.Server
export default (req, res, next) => {
  const token = getToken(req)

  verifyClient(req, token, success => {
    if (success) {
      next()
    } else {
      res.status(403).send(JSON.stringify({ error: 'Invalid Token' }))
    }
  })
}
