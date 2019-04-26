import express from 'express'
import { login, oauth_redirect } from './controllers/user'

let routes = express.Router()

routes.post('/login', login)
routes.get('/oauth/redirect', oauth_redirect)

export default routes
