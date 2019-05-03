import mongoose from 'mongoose'
import uuid from 'uuid/v1'

export const MESSAGE_MODEL_NAME = 'Message'

export const MESSAGE_TYPE_TEXT = 'text'
export const MESSAGE_TYPE_IMAGE = 'image'

export const FILE_REGEXP = /^((http(s)?)|(s3)):\/\/[^.]*/
function validateContent(content) {
  switch (this.type) {
    case MESSAGE_TYPE_TEXT:
      return content ? true : false
    case MESSAGE_TYPE_IMAGE:
      return content.match(FILE_REGEXP)
    default:
      return false
  }
}

const MessageSchema = new mongoose.Schema({
  _id: String,
  from: { type: String, required: true },
  to: { type: String, required: true },
  timestamp: { type: Date, required: true },
  type: {
    type: String,
    required: true,
    enum: [MESSAGE_TYPE_TEXT, MESSAGE_TYPE_IMAGE],
  },
  content: {
    type: String,
    required: true,
    validate: [validateContent, 'Admin list depends on room type'],
  },
})

const Message = mongoose.model(MESSAGE_MODEL_NAME, MessageSchema)
export default Message

export const createMessage = ({ from, to, content, type }) => {
  return Message({
    _id: uuid(),
    timestamp: Date.now(),
    from,
    to,
    content,
    type,
  })
}
