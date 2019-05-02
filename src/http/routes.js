import express from 'express'
import verifyHTTPRequest from './middlewares/verifyHTTPRequest'
import { login, oauth_redirect } from './controllers/auth'
import { getRoom, inviteToRoom } from './controllers/rooms'

let routes = express.Router()

routes.post('/login', login)
routes.get('/oauth/redirect', oauth_redirect)

routes.get('/room/:roomId', verifyHTTPRequest, getRoom)
routes.get('/rooms', verifyHTTPRequest, getRoom)

export default routes
