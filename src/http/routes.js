import express from 'express'
import verifyUser from './middlewares/verifyHTTPRequest'
import upload from './middlewares/fileUpload'
import * as AuthController from './controllers/auth'
import * as RoomController from './controllers/room'
import * as UserController from './controllers/user'
import * as MessageController from './controllers/message'

let routes = express.Router()

routes.post('/login', AuthController.login)
routes.get('/oauth/redirect', AuthController.oauth_redirect)

routes.post('/rooms', verifyUser, RoomController.newGroupRoom)
routes.post('/rooms/duo', verifyUser, RoomController.newDuoRoom)
routes.get('/rooms', verifyUser, RoomController.getAllRooms)
routes.get('/room/:roomId', verifyUser, RoomController.getRoom)
routes.delete('/room/:roomId', verifyUser, RoomController.deleteRoom)
routes.put('/room/:roomId/members', verifyUser, RoomController.inviteUser) //
routes.delete('/room/:roomId/members', verifyUser, RoomController.kickoutUser) //
// routes.get('/room/:roomId/members', verifyUser, RoomController.getMembers)//

routes.get('/room/:roomId/messages', verifyUser, MessageController.getMessages)
routes.get('/room/:roomId/file/:fileId', verifyUser, MessageController.getFile)

routes.post(
  '/room/:roomId/messages',
  verifyUser,
  upload.single('content'),
  MessageController.postMessage
)

routes.get('/user/:userId', UserController.getUser)

export default routes
