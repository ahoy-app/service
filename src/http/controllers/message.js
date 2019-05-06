import {
  default as Message,
  createMessage,
  MESSAGE_TYPE_TEXT,
  MESSAGE_TYPE_IMAGE,
} from '../../model/Message'
import { RoomModel } from '../../model/Room'
import Attachment from '../../model/Attachment'
import { new_message } from '../../events/message'

const PAGE_SIZE = 5

const payload = message => ({
  id: message._id,
  from: message.from,
  to: message.to,
  content: message.content,
  type: message.type,
})

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

  res.send(messages.map(message => payload(message)))
}

export const getFile = async (req, res) => {
  const room = await RoomModel.findById(req.params.roomId)

  if (!room) {
    res.status(404).send('Room not found')
    return
  }

  if (!(room.members.includes(req.userId) || room.admin.includes(req.userId))) {
    res.status(403).send('You are not in this room')
    return
  }

  const file = await Attachment.findById(req.params.fileId)

  if (file.metadata.roomId != room._id) {
    res.status(403).send("This file doesn't belong to this room")
    return
  }

  const buffer = await file.read()

  res.set(
    'Content-Disposition',
    `attachment; filename=${file.metadata.originalname}`
  )
  res.send(buffer)
}

export const postMessage = async (req, res) => {
  const room = await RoomModel.findById(req.params.roomId)

  if (!room) {
    res.status(404).send('Room not found')
    return
  }

  if (!(room.members.includes(req.userId) || room.admin.includes(req.userId))) {
    res.status(403).send('You are not in this room')
    return
  }

  if (!(req.body.content || req.file)) {
    res.status(400).send('Empty message')
    return
  }

  let message

  if (req.file) {
    // With attachment

    const { buffer, ...meta } = req.file

    let uploaded_file = new Attachment({
      metadata: { ...meta, roomId: room._id },
    })

    uploaded_file = await uploaded_file.write(buffer)

    message = createMessage({
      from: req.userId,
      to: room._id,
      content: uploaded_file._id,
      type: MESSAGE_TYPE_IMAGE,
    })
  } else {
    // Not attachment
    message = createMessage({
      from: req.userId,
      to: room._id,
      content: req.body.content,
      type: MESSAGE_TYPE_TEXT,
    })
  }
  message = await message.save()
  res.dispatch(new_message(payload(message)))
  res.send({
    id: message._id,
    timestamp: message.timestamp,
    content: message.content,
  })
}
