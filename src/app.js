import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

// MIDDLEWARES

// Express
const app = express()

// Logging
app.use(morgan('dev'))

// Body parsing
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// MIDDLEWARES

// Static files
app.use(express.static('public'))

export default app
