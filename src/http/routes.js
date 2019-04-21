import express from 'express'
import { login } from './controllers/login'

let routes = express.Router()

routes.post('/login', login)

export default routes
