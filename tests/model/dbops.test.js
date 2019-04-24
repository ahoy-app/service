import { expect } from 'chai'
import mdb from '../../src/config/mdb'
import User from '../../src/model/User'
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

      expect(result._doc).to.have.property('_id', 'mike')
      expect(result._doc).to.have.property('name', 'Mike')
      expect(result._doc).to.have.property('role', 'user')
      expect(result._doc).to.have.property('crypto')
      expect(result._doc.crypto).to.have.property('public', 'aaa')
      expect(result._doc.crypto).to.have.property('private', 'aaa')
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
      })
    })
  })
})
