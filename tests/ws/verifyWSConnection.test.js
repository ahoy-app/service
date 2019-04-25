import sinon from 'sinon'
import { assert, expect } from 'chai'

import verifyWSConnection from '../../src/ws/verifyWSConnection'
import { signToken } from '../../src/auth/jwt'

describe('Web Socket Connection verification', () => {
  it('Should reject verification wih no token', () => {
    const req = {}
    const done = sinon.fake()

    verifyWSConnection({ req }, done)

    assert(done.calledWith(false, 403))
  })

  it('Should reject verification with empty token', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTU2ODg3NjAsImV4cCI6MTU1NTY4ODgyMH0.6ft1hkd4lOp3dBx-GxwSbqQdbBd4rWS56Jl1lnUTcX4'
    const req = { url: `ws://local.domain:0000/ws?token=${token}` }
    const done = sinon.fake()

    verifyWSConnection({ req }, done)

    assert(done.calledWith(false, 403))
  })

  it('Should not accept verification with valid token without user', () => {
    const token = signToken({})
    const req = { url: `ws://local.domain:0000/ws?token=${token}` }
    const done = sinon.fake()

    verifyWSConnection({ req }, done)

    assert(done.calledWith(false))
  })

  it('Should accept verification with valid token and add a valid user to req', () => {
    const token = signToken({ user: 'mike' })
    const req = { url: `ws://local.domain:0000/ws?token=${token}` }
    const done = sinon.fake()

    verifyWSConnection({ req }, done)

    assert(done.calledWith(true))
    expect(req.userId).to.equal('mike')
  })
})
