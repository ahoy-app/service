import mongoose from 'mongoose'
import uuid from 'uuid/v1'
import md5 from 'md5'

export const ROOM_MODEL_NAME = 'Room'

export const ROOM_TYPE_GROUP = 'group'
export const ROOM_TYPE_DUO = 'duo'
export const ROOM_TYPE_SYSTEM = 'system'

const provided = val => {
  return val ? true : false
}

function validateAdmin(admin) {
  switch (this.type) {
    case ROOM_TYPE_GROUP:
      return admin.length === 1 && provided(admin[0])
    case ROOM_TYPE_DUO:
      return admin.length === 2 && provided(admin[0]) && provided(admin[1])
    case ROOM_TYPE_SYSTEM:
      return admin.length === 0
    default:
      return false
  }
}

function validateMembers(members) {
  switch (this.type) {
    case ROOM_TYPE_GROUP:
      return members.length >= 0
    case ROOM_TYPE_DUO:
      return members.length === 0
    case ROOM_TYPE_SYSTEM:
      return members.length === 0
    default:
      return false
  }
}

const RoomSchema = new mongoose.Schema({
  _id: String,
  type: {
    type: String,
    required: true,
    enum: [ROOM_TYPE_GROUP, ROOM_TYPE_DUO, ROOM_TYPE_SYSTEM],
  },
  name: { type: String, required: true },
  admin: {
    type: [String],
    required: true,
    validate: [validateAdmin, 'Admin list depends on room type'],
  },
  members: {
    type: [String],
    required: true,
    validate: [validateMembers, 'Members list depends on room type'],
  },
})

RoomSchema.methods.addUser = function(user) {
  if (!this.members.includes(user)) {
    this.members.push(user)
  } else {
    console.warn('Trying to include an existing user in a room')
  }
}

RoomSchema.methods.deleteUser = function(user) {
  if (this.members.includes(user)) {
    this.members = this.members.filter(member => member != user)
  } else {
    console.warn('Trying to include an existing user in a room')
  }
}

export const RoomModel = mongoose.model(ROOM_MODEL_NAME, RoomSchema)

export const createDuoRoom = ({ members = [] }) => {
  members.sort()
  return RoomModel({
    _id: md5(`${members[0]}-${members[1]}`).substring(0, 8),
    type: ROOM_TYPE_DUO,
    name: `${members[0]}-${members[1]}`,
    admin: members,
    members: [],
  })
}

export const createGroupRoom = ({ admin, name }) => {
  return RoomModel({
    _id: uuid().substring(0, 8),
    type: ROOM_TYPE_GROUP,
    name: name,
    admin: [admin],
    members: [],
  })
}

//TODO: export const createSystemRoom = ({ admin, name }) => {}