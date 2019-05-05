import { expect } from 'chai'

import { RoomModel, createGroupRoom, createDuoRoom } from '../../src/model/Room'

describe('Room model', () => {
  describe('Basic Room model', () => {
    it('Should be invalid if nothing is provided', done => {
      var room = new RoomModel({})

      room.validate(err => {
        expect(err.errors).to.exist
        done()
      })
    })

    it('Should be invalid if a wrong type is provided', done => {
      var room = RoomModel({ type: 'invalid-type' })

      room.validate(err => {
        expect(err.errors).to.include.keys('type')
        done()
      })
    })
  })

  describe('Duo Room model', () => {
    it('Should be invalid if nothing is provided', done => {
      var room = createDuoRoom({})

      room.validate(err => {
        expect(err.errors).to.have.keys('admin')
        done()
      })
    })

    it('Should be invalid if no members are provided', done => {
      var room = createDuoRoom({ members: [] })

      room.validate(err => {
        expect(err.errors).to.have.keys('admin')
        done()
      })
    })

    it('Should be invalid if just one member is provided', done => {
      var room = createDuoRoom({ members: ['a'] })

      room.validate(err => {
        expect(err.errors).to.have.keys('admin')
        done()
      })
    })

    it('Should be valid if just two members are provided', done => {
      var room = createDuoRoom({ members: ['a', 'b'] })

      room.validate(err => {
        expect(err).to.not.exist
        done()
      })
    })

    it('Should be invalid if more than two members are provided', done => {
      var room = createDuoRoom({ members: ['a', 'b', 'c'] })

      room.validate(err => {
        expect(err.errors).to.have.keys('admin')
        done()
      })
    })
  })

  describe('Group Room model', () => {
    it('Should be invalid if nothing is provided', done => {
      var room = createGroupRoom({})

      room.validate(err => {
        expect(err.errors).to.have.keys('admin', 'name')
        done()
      })
    })

    it('Should be invalid if fields are empty', done => {
      var room = createGroupRoom({ admin: '', name: '' })

      room.validate(err => {
        expect(err.errors).to.have.keys('admin', 'name')
        done()
      })
    })

    it('Should be invalid if name is empty', done => {
      var room = createGroupRoom({ admin: 'admin', name: '' })

      room.validate(err => {
        expect(err.errors).to.have.keys('name')
        done()
      })
    })

    it('Should be invalid if name is empty', done => {
      var room = createGroupRoom({ admin: '', name: 'room' })

      room.validate(err => {
        expect(err.errors).to.have.keys('admin')
        done()
      })
    })

    it('Should be valid if admin and name are provided', done => {
      var room = createGroupRoom({ admin: 'admin', name: 'room' })

      room.validate(err => {
        expect(err).to.not.exist
        done()
      })
    })
  })
  describe('System Room model', () => {
    //TODO: TO be implemented
  })
})
