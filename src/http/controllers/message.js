import {
  default as Message,
  createMessage,
  MESSAGE_TYPE_TEXT,
} from '../../model/Message'
import { RoomModel } from '../../model/Room'
const PAGE_SIZE = 5

export const getMessages = async (req, res) => {
  const room = await RoomModel.findById(req.params.roomId)

  if (!room) {
    res.status(404).send('Room not found')
    return
  }

  if (!(room.members.includes(req.userId) || room.admin.includes(req.userId))) {
    res.status(403).send('You are not in this room')
    return
  }

  const find = req.body.before
    ? Message.find({
        to: req.params.roomId,
        timestamp: { $lte: req.body.before },
      })
    : Message.find({ to: req.params.roomId })

  const messages = await find.limit(PAGE_SIZE).sort({ timestamp: 'desc' })

  res.send(
    messages.map(message => ({
      id: message._id,
      timestamp: message.timestamp,
      content: message.content,
    }))
  )
}

export const postTextMessage = async (req, res) => {
  const room = await RoomModel.findById(req.params.roomId)

  if (!room) {
    res.status(404).send('Room not found')
    return
  }

  if (!(room.members.includes(req.userId) || room.admin.includes(req.userId))) {
    res.status(403).send('You are not in this room')
    return
  }

  let message = createMessage({
    from: req.userId,
    to: room._id,
    content: req.body.content,
    type: MESSAGE_TYPE_TEXT,
  })

  message = await message.save()
  res.send({ id: message._id, timestamp: message.timestamp })
}
