import mongoose from 'mongoose'
import dotenv from 'dotenv'

//Config
dotenv.config()
const mdb_host = process.env.MDB_HOST
const mdb_port = process.env.MDB_PORT
const mdb_name = process.env.MDB_NAME
// const mdb_user = process.env.MDB_USER
// const mdb_pass = process.env.MDB_PASS

export default mongoose.connect(
  `mongodb://${mdb_host}:${mdb_port}/${mdb_name}`,
  { useNewUrlParser: true }
)
