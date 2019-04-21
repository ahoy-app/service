import Rabbit from 'amqplib'
import dotenv from 'dotenv'

//Config
dotenv.config()
const amqp_host = process.env.AMQP_HOST
const amqp_port = process.env.AMQP_PORT
// const amqp_user = process.env.AMQP_USER
// const amqp_pass = process.env.AMQP_PASS

//Connect
export default Rabbit.connect(`amqp://${amqp_host}:${amqp_port}`)
