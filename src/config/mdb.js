import mongoose from 'mongoose'
import dotenv from 'dotenv'

import promiseRetry from '../utils/promiseRetry'

//Config
dotenv.config()
const mdb_host = process.env.MDB_HOST
const mdb_port = process.env.MDB_PORT
const mdb_name = process.env.MDB_NAME
// const mdb_user = process.env.MDB_USER
// const mdb_pass = process.env.MDB_PASS

const connect = () => {
  console.log('Connecting to MongoDB')
  return mongoose.connect(`mongodb://${mdb_host}:${mdb_port}/${mdb_name}`, {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
  })
}

export default () =>
  promiseRetry(connect, 'Unable to connect to Mongo DB. Retrying...') //Returns a Promise that allways retries itself
