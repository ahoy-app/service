import sinon from 'sinon'
import { assert, expect } from 'chai'

import verifyClient from '../../src/auth/verifyClient'
import { signToken } from '../../src/auth/jwt'

describe('Client verification', () => {
  it('Should reject an empty token', () => {
    const req = {}
    const token = ''
    const callback = sinon.fake()

    verifyClient(req, token, callback)

    assert(callback.calledWith(false))
    expect(req.user).to.be.undefined
  })

  it('Should reject an invalid token', () => {
    const req = {}
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTU2ODg3NjAsImV4cCI6MTU1NTY4ODgyMH0.6ft1hkd4lOp3dBx-GxwSbqQdbBd4rWS56Jl1lnUTcX4'
    const callback = sinon.fake()

    verifyClient(req, token, callback)

    assert(callback.calledWith(false))
    expect(req.user).to.be.undefined
  })

  it('Should accept a valid token', () => {
    const req = {}
    const token = signToken({})
    const callback = sinon.fake()

    verifyClient(req, token, callback)
    const { name, rooms } = req.user

    assert(callback.calledWith(true))
    expect(name).to.be.undefined
    expect(rooms).to.be.undefined
  })

  it('Should accept a valid token and add a correct user to req', () => {
    const req = {}
    const token = signToken({ user: 'mike' })
    const callback = sinon.fake()

    verifyClient(req, token, callback)
    const { name, rooms } = req.user

    assert(callback.calledWith(true))
    expect(name).to.equal('mike')
    expect(rooms).to.be.a('array')
  })
})
