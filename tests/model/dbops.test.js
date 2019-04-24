import { expect } from 'chai'
import mdb from '../../src/config/mdb'
import User from '../../src/model/User'
import Message from '../../src/model/Message'
import { RoomModel, createDuoRoom, createGroupRoom } from '../../src/model/Room'

describe.skip('Db ops', () => {
  before(done => {
    mdb.then(() => done())
  })

  describe('User', () => {
    const userFields = {
      _id: 'mike',
      name: 'Mike',
      role: 'user',
      crypto: { public: 'aaa', private: 'aaa' },
    }

    let user

    beforeEach(() => {
      user = new User(userFields)
    })

    afterEach(() => {
      user.delete()
    })

    it('Saves and finds', async () => {
      await user.save()

      const result = await User.findById(user._id)

      expect(result).to.exist
      expect(result).to.include.keys('_doc')

      expect(result._doc).to.have.property('_id', user._id)
      expect(result._doc).to.have.property('name', user.name)
      expect(result._doc).to.have.property('role', user.role)
      expect(result._doc).to.have.property('crypto')
      expect(result._doc.crypto).to.have.property('public', user.crypto.public)
      expect(result._doc.crypto).to.have.property(
        'private',
        user.crypto.private
      )
    })

    it('Query', async () => {
      const user2 = new User({
        ...userFields,
        _id: 'tom',
      })
      const user3 = new User({
        ...userFields,
        _id: 'hannah',
        role: 'admin',
      })

      await user.save()
      await user2.save()
      await user3.save()

      const all = await User.find({})
      const admins = await User.find({ role: 'admin' })
      const users = await User.find({ role: 'user' })

      await user2.delete()
      await user3.delete()

      expect(all).to.have.length(3)
      expect(admins).to.have.length(1)
      expect(users).to.have.length(2)
    })

    it('Find rooms', async () => {
      const room = createDuoRoom({ members: ['mike', 'hannah'] })
      const room2 = createDuoRoom({ members: ['tom', 'mike'] })

      await room.save()
      await room2.save()

      const userRooms = await user.findRooms()

      await room.delete()
      await room2.delete()

      expect(userRooms).to.have.length(2)
    })
  })
  describe('Room', () => {
    describe('Duo Room', () => {
      let room

      beforeEach(() => {
        room = createDuoRoom({ members: ['mike', 'hannah'] })
      })

      afterEach(() => {
        room.delete()
      })

      it('Saves and finds', async () => {
        await room.save()

        const result = await RoomModel.findById(room._id)

        expect(result).to.exist
        expect(result).to.include.keys('_doc')

        expect(result._doc).to.have.property('_id', room._id)
        expect(result._doc).to.have.property('members')
        expect(result._doc.members).to.have.length(2)
      })
    })
    describe('Group Room', () => {
      let room

      beforeEach(() => {
        room = createGroupRoom({ admin: 'mike', name: 'football' })
      })

      afterEach(() => {
        room.delete()
      })

      it('Saves and finds', async () => {
        await room.save()

        const result = await RoomModel.findById(room._id)

        expect(result).to.exist
        expect(result).to.include.keys('_doc')

        expect(result._doc).to.have.property('_id', room._id)
        expect(result._doc).to.have.property('members')
        expect(result._doc.members).to.have.length(0)
      })

      it('Adds a user to a group', async () => {
        await room.save()

        room.addUser('tom')
        room.addUser('hannah')
        room.addUser('fluffy')

        expect(room.members).to.have.length(3)

        await room.save()

        const result = await RoomModel.findById(room._id)

        expect(result).to.exist
        expect(result).to.include.keys('_doc')

        expect(result._doc).to.have.property('_id', room._id)
        expect(result._doc).to.have.property('members')
        expect(result._doc.members).to.have.length(3)
      })
    })
  })
  describe('Message', () => {
    const messageFields = {
      _id: 'aseifuq349f',
      from: 'mike',
      to: 'tom',
      type: 'text',
      content: 'Hi dude',
    }

    let message

    beforeEach(() => {
      message = new Message(messageFields)
    })

    afterEach(() => {
      message.delete()
    })

    it('Saves and finds', async () => {
      await message.save()

      const result = await Message.findById(message._id)

      expect(result).to.exist
      expect(result).to.include.keys('_doc')

      expect(result._doc).to.have.property('_id', message._id)
      expect(result._doc).to.have.property('content', message.content)
    })
  })
})
