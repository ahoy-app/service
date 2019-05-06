import mongoose from 'mongoose'
import dotenv from 'dotenv'

import promiseRetry from '../utils/promiseRetry'
import { RoomModel } from '../model/Room'
import User from '../model/User'

//Config
dotenv.config()
const mdb_host = process.env.MDB_HOST
const mdb_port = process.env.MDB_PORT
const mdb_name = process.env.MDB_NAME
// const mdb_user = process.env.MDB_USER
// const mdb_pass = process.env.MDB_PASS

const assertPrerequirements = async () => {
  let room = await RoomModel.findById('ahoy')
  if (!room) {
    console.log('BROADCAST ROOM CREATED')
    room = new RoomModel({
      _id: 'ahoy',
      type: 'system',
      name: 'Ahoy',
      admin: [],
      members: [],
    })
    await room.save()
  }

  let admin = await User.findById('admin')
  if (!admin) {
    console.log('ADMIN USER CREATED')
    admin = new User({
      _id: 'admin',
      name: 'Admin',
      role: 'admin',
      crypto: { public: 'aaa', private: 'aaa' },
    })
    await admin.save()
  }
  return true
}

const connect = async () => {
  console.log('Connecting to MongoDB')
  const connection = await mongoose.connect(
    `mongodb://${mdb_host}:${mdb_port}/${mdb_name}`,
    {
      useNewUrlParser: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
    }
  )
  await assertPrerequirements()
  return connection
}

export default () =>
  promiseRetry(connect, 'Unable to connect to Mongo DB. Retrying...') //Returns a Promise that allways retries itself
