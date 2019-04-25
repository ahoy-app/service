import sinon from 'sinon'
import { assert, expect } from 'chai'

import User from '../../src/model/User'
import { RoomModel } from '../../src/model/Room'

describe('User model', () => {
  describe('User model constructor', () => {
    const crypto = { public: 'public-key', private: 'private-hashed-key' }
    const validUser = { name: 'name', role: 'user', crypto }

    it('Should be invalid if nothing is provided', done => {
      var user = new User({})

      user.validate(err => {
        expect(err.errors).to.exist
        done()
      })
    })

    it('Should be invalid if no name is provided', done => {
      // eslint-disable-next-line no-unused-vars
      const { name, ...invalidUser } = validUser
      var user = new User(invalidUser)

      user.validate(err => {
        expect(err.errors).to.have.keys('name')
        done()
      })
    })

    it('Should be invalid if name is empty', done => {
      var user = new User({ ...validUser, name: '' })

      user.validate(err => {
        expect(err.errors).to.have.keys('name')
        done()
      })
    })

    it('Should be invalid if no role is provided', done => {
      // eslint-disable-next-line no-unused-vars
      const { role, ...invalidUser } = validUser
      var user = new User(invalidUser)

      user.validate(err => {
        expect(err.errors).to.have.keys('role')
        done()
      })
    })

    it('Should be invalid if role is wrong', done => {
      var user = new User({ ...validUser, role: 'invalid' })

      user.validate(err => {
        expect(err.errors).to.have.keys('role')
        done()
      })
    })

    it('Should be invalid if crypto is empty', done => {
      var user = new User({ ...validUser, crypto: {} })

      user.validate(err => {
        expect(err.errors).to.have.keys('crypto.private', 'crypto.public')
        done()
      })
    })

    it('Should be valid if name, user and crypto are provided', done => {
      var user = new User(validUser)

      user.validate(err => {
        expect(err).to.not.exist
        done()
      })
    })
  })

  describe('User model functions', () => {
    after(() => {
      sinon.restore()
    })

    it('Should call find to find the user by its name', async () => {
      sinon.stub(RoomModel, 'find')

      const user = new User({ _id: 'mike', name: 'Mike' })

      await user.findRooms()

      assert(RoomModel.find.calledOnce)
    })
  })
})
