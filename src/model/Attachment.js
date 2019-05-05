import mongoose from 'mongoose'
import uuid from 'uuid/v1'

const newGS = (id, metadata, mode) => {
  const options = metadata ? { metadata } : {}
  return new mongoose.mongo.GridStore(
    mongoose.connection.db,
    id,
    id,
    mode,
    options
  ).open()
}

class Attachment {
  constructor({ _id = uuid(), metadata }) {
    this._id = _id
    this.metadata = metadata
    this._gs = undefined
  }

  async open(mode) {
    this._gs = await newGS(this._id, this.metadata, mode)
  }

  isOpen() {
    return this._gs ? true : false
  }

  async write(buffer) {
    if (!this.isOpen()) {
      await this.open('w')
    }
    const stored = await this._gs.write(buffer).then(gs => gs.close())
    this._id = stored._id
    return this
  }

  async read() {
    if (!this.isOpen()) {
      await this.open('r')
    }
    return await this._gs.read()
  }

  static async findById(_id) {
    const att = new Attachment({ _id })
    await att.open('r')
    att.metadata = att._gs.metadata

    return att
  }
}

export default Attachment
