import {
  RoomModel,
  createGroupRoom,
  createDuoRoom,
  ROOM_TYPE_GROUP,
} from '../../model/Room'
import User from '../../model/User'
import {
  room_deleted,
  room_created,
  user_invited,
  user_kicked,
} from '../../events/room'

const payload = room => ({
  id: room._id,
  type: room.type,
  name: room.name,
  admin: room.admin,
  members: room.members,
})

export const getRoom = async (req, res) => {
  const room = await RoomModel.findById(req.params.roomId)

  if (!room) {
    res.status(404).send('Room not found')
    return
  }
  res.send(payload(room))
}

export const deleteRoom = async (req, res) => {
  const room = await RoomModel.findById(req.params.roomId)

  if (!room) {
    res.status(404).send('Room not found')
    return
  }

  if (!room.admin.includes(req.userId)) {
    res.status(403).send('You are not admin of this room')
    return
  }

  await room.delete()
  res.dispatch(room_deleted(room._id))
  res.send('Deleted')
}

export const getAllRooms = async (req, res) => {
  const user = await User.findById(req.userId)

  if (!user) {
    res.status(500).send('Loged in user not found')
    return
  }

  const rooms = await user.findRooms()
  res.send({ rooms: rooms.map(room => ({ id: room._id, name: room.name })) })
}

export const newGroupRoom = async (req, res) => {
  let room = createGroupRoom({ admin: req.userId, name: req.body.title })

  room = await room.save()
  res.dispatch(room_created(payload(room)))
  res.dispatch(user_invited(req.userId, payload(room)))
  res.send(payload(room))
}

export const newDuoRoom = async (req, res) => {
  const secondUser = await User.findById(req.body.user)

  if (!secondUser) {
    res.status(409).send("The target user doesn't exists")
    return
  }

  let room = createDuoRoom({ members: [req.userId, req.body.user] })

  if (await RoomModel.findById(room._id)) {
    res.status(409).send('Duo room already exists')
    return
  }

  room = await room.save()
  res.dispatch(room_created(payload(room)))
  res.dispatch(user_invited(req.userId, payload(room)))
  res.dispatch(user_invited(secondUser._id, payload(room)))
  res.send(payload(room))
}

export const inviteUser = async (req, res) => {
  const activeUserId = req.userId
  const passiveUserId = req.body.user

  const room = await RoomModel.findById(req.params.roomId)
  if (!room) {
    res.status(404).send('Room not found')
    return
  }

  if (!room.admin.includes(activeUserId)) {
    res.status(403).send('You are not admin of this room')
    return
  }

  if (room.admin.includes(passiveUserId)) {
    res.status(409).send('User is already and admin of the room')
    return
  }

  if (room.members.includes(passiveUserId)) {
    res.status(409).send('User is already in the room')
    return
  }

  if (!(room.type == ROOM_TYPE_GROUP)) {
    res.status(400).send('You can just add members to a group room')
    return
  }

  const passiveUser = await User.findById(passiveUserId)

  if (!passiveUser) {
    res.status(409).send(`User ${passiveUserId} not found`)
    return
  }

  room.addUser(passiveUser._id)
  await room.save()
  res.dispatch(user_invited(passiveUser._id, payload(room)))
  res.send('User added correctly')
}

export const kickoutUser = async (req, res) => {
  const activeUserId = req.userId
  const passiveUserId = req.body.user

  const room = await RoomModel.findById(req.params.roomId)
  if (!room) {
    res.status(404).send('Room not found')
    return
  }

  if (!room.admin.includes(activeUserId)) {
    res.status(403).send('You are not admin of this room')
    return
  }

  if (room.admin.includes(passiveUserId)) {
    res.status(403).send('You cannot kickout an admin')
    return
  }

  if (
    !room.members.includes(passiveUserId) &&
    !room.admin.includes(passiveUserId)
  ) {
    res.status(403).send('User is not in the room')
    return
  }

  if (!(room.type == ROOM_TYPE_GROUP)) {
    res.status(400).send('You can just kickout members from a group room')
    return
  }

  const passiveUser = await User.findById(passiveUserId)

  if (!passiveUser) {
    res.status(404).send('User not found')
    return
  }

  room.deleteUser(passiveUser._id)
  await room.save()
  res.dispatch(user_kicked(passiveUser._id, payload(room)))
  res.send('User kicked out correctly')
}
