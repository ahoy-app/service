import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import routes from './routes'

// Express
const app = express()

// Logging
app.use(morgan('dev'))

// Body parsing
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Static files
app.use(express.static('public'))
app.use('/', routes)

export default app
