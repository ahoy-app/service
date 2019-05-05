import {
  default as Message,
  createMessage,
  MESSAGE_TYPE_TEXT,
  MESSAGE_TYPE_IMAGE,
} from '../../model/Message'
import { RoomModel } from '../../model/Room'
import { uploadFile, downloadFile } from '../../config/gridfs'

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

  const file = await downloadFile(req.params.fileId)
  console.log(file)
  res.set('Content-Disposition', `attachment; filename=${file.name}`)
  res.send(file.buffer)
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

  if (!(req.body.content || req.file)) {
    res.status(400).send('Empty message')
    return
  }

  let message
  console.log(req.file, req.body.content)

  if (req.file) {
    // With attachment
    const uploaded_file = await uploadFile(req.file, room._id)
    console.log(uploaded_file)
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
  res.send({
    id: message._id,
    timestamp: message.timestamp,
    content: message.content,
  })
}
