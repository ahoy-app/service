import sinon from 'sinon'
import { assert, expect } from 'chai'

import { mockRequest, mockResponse } from '../../utils/mock-req-res'

import verifyHTTPRequest from '../../../src/http/middlewares/verifyHTTPRequest'
import { signToken } from '../../../src/auth/jwt'

describe('HTTP Request verification', () => {
  it('Should reject no header', () => {
    const req = mockRequest()
    const res = mockResponse()
    const next = sinon.fake()

    verifyHTTPRequest(req, res, next)

    assert(res.status.calledWith(403))
    assert(res.send.calledOnce)
    expect(req.user).to.be.undefined
  })

  it('Should reject an invalid token', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTU2ODg3NjAsImV4cCI6MTU1NTY4ODgyMH0.6ft1hkd4lOp3dBx-GxwSbqQdbBd4rWS56Jl1lnUTcX4'
    const req = mockRequest({ headers: { Authorization: `Bearer ${token}` } })
    const res = mockResponse()
    const next = sinon.fake()

    verifyHTTPRequest(req, res, next)

    assert(res.status.calledWith(403))
    assert(res.send.calledOnce)
    expect(req.user).to.be.undefined
  })

  it('Should accept a valid token', () => {
    const token = signToken({})
    const req = mockRequest({ headers: { authorization: `Bearer ${token}` } })
    const res = mockResponse()
    const next = sinon.fake()

    verifyHTTPRequest(req, res, next)

    assert(next.calledOnce)
  })

  it('Should accept a valid token and add a correct user to req', () => {
    const token = signToken({ user: 'mike' })
    const req = mockRequest({ headers: { authorization: `Bearer ${token}` } })
    const res = mockResponse()
    const next = sinon.fake()

    verifyHTTPRequest(req, res, next)
    const { name, rooms } = req.user

    assert(next.calledOnce)
    expect(name).to.equal('mike')
    expect(rooms).to.be.a('array')
  })
})
