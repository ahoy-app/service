import express from 'express'
import { signToken } from '../auth/jwt'

let routes = express.Router()

routes.post('/login', (req, res) => {
  const user = req.body.user

  if (['mike', 'tom', 'hannah'].includes(user)) {
    const token = signToken({ user })
    res.send(JSON.stringify({ token }))
  } else {
    res.status(403).send(JSON.stringify({ error: 'User not signed' }))
  }
})

export default routes
