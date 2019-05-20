import mongoose from 'mongoose'

// const danger_words = ['winnie', 'fortnite', 'joker']
const getDangerWords = async () => {
  const dangerCollection = await mongoose.connection.db.collection(
    'danger-words'
  )

  const danger_words = await dangerCollection.find().toArray()
  return danger_words.map(doc => doc.word)
}

export const censoreMessage = async message => {
  const { content } = message

  const danger_words = await getDangerWords()
  const new_content = danger_words.reduce(
    (total, actual) => total.replace(new RegExp(actual, 'ig'), '***'),
    content
  )

  if (message.content !== new_content)
    console.log(`CENSORED: ${message.from} => ${message.content}`)

  message.content = new_content
  return message
}
