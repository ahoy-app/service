import express from 'express'
import verifyHTTPRequest from './middlewares/verifyHTTPRequest'
import { login, oauth_redirect } from './controllers/auth'
import {
  getRoom,
  deleteRoom,
  getAllRooms,
  inviteUser,
  kickoutUser,
  newGroupRoom,
  newDuoRoom,
} from './controllers/room'
import { getUser } from './controllers/user'

let routes = express.Router()

routes.post('/login', login)
routes.get('/oauth/redirect', oauth_redirect)

routes.get('/rooms', verifyHTTPRequest, getAllRooms)
routes.post('/rooms', verifyHTTPRequest, newGroupRoom)
routes.get('/room/:roomId', verifyHTTPRequest, getRoom)
routes.delete('/room/:roomId', verifyHTTPRequest, deleteRoom)
routes.put('/room/:roomId/invite', verifyHTTPRequest, inviteUser)
routes.put('/room/:roomId/kickout', verifyHTTPRequest, kickoutUser)

routes.post('/room/duo', verifyHTTPRequest, newDuoRoom)

routes.get('/user/:userId', getUser)

export default routes
