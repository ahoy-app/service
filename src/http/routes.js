import express from 'express'
import { login } from './controllers/user'

let routes = express.Router()

routes.post('/login', login)

export default routes
