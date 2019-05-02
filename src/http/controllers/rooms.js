import { RoomModel, createGroupRoom, createDuoRoom } from '../../model/Room'

export const getRoom = async (req, res) => {
  const room = await RoomModel.findById(req.params.roomId)

  if (!room) {
    res.status(404).send('Room not found')
    return
  }
  res.send({ id: room._id, admin: room.admin, members: room.members })
}

export const inviteToRoom = (req, res) => {
  res.send('Hello ' + req.params.roomId)
}
