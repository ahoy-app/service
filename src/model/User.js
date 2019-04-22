import mongoose from 'mongoose'

import { ROOM_MODEL_NAME } from './Room'

export const USER_MODEL_NAME = 'User'

export const USER_ROLE_USER = 'user'
export const USER_ROLE_ADMIN = 'admin'

const User = new mongoose.Schema({
  _id: String,
  name: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: [USER_ROLE_USER, USER_ROLE_ADMIN],
  },
  crypto: {
    public: { type: String, required: true },
    private: { type: String, required: true },
  },
})

User.methods.findRooms = function(cb) {
  this.model(ROOM_MODEL_NAME).find(
    {
      members: this.name,
    },
    function(err, val) {
      cb(!!val)
    }
  )
}

export default mongoose.model(USER_MODEL_NAME, User)
