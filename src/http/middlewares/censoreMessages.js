import mung from 'express-mung'
import { censoreMessage } from '../controllers/censorship'

const censoreMessages = async body => {
  if (Array.isArray(body) && body.length > 0 && body[0].content) {
    return await Promise.all(body.map(msg => censoreMessage(msg)))
  } else if (body.content) {
    return await censoreMessage(body)
  }
  return body
}

export default mung.jsonAsync(censoreMessages)
