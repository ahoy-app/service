import mongoose from 'mongoose'
import uuid from 'uuid/v1'

export const uploadFile = async (file, roomId) => {
  console.log('Uploading ', file)

  const id = uuid()
  const gridStore = await new mongoose.mongo.GridStore(
    mongoose.connection.db,
    id,
    id,
    'w',
    {
      metadata: { roomId, name: file.originalname },
    }
  ).open()

  const result = await gridStore
    .write(file.buffer)
    .then(gs => gs.close(file.buffer))

  return result
}

export const downloadFile = async id => {
  console.log('Checking ', id)

  const gridStore = await new mongoose.mongo.GridStore(
    mongoose.connection.db,
    id,
    'r'
  ).open()

  const result = gridStore.metadata
  result.buffer = await gridStore.read()

  return result
}
