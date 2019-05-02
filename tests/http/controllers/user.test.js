import sinon from 'sinon'
import { assert, expect } from 'chai'

import { mockRequest, mockResponse } from '../../utils/mock-req-res'

import { login } from '../../../src/http/controllers/user'
import * as JWT from '../../../src/auth/jwt'
import User from '../../../src/model/User'

describe('User Controller', () => {
  const secretpass = 'secretpass'

  describe('Login route', () => {
    beforeEach(() => {
      sinon.stub(JWT, 'signToken').returns('-mock-token')
      JWT.jwt_secret = secretpass
    })

    afterEach(() => {
      sinon.restore()
    })

    it('Should reject login with no user provided and no passkey provided', async () => {
      const req = mockRequest({ body: {} })
      const res = mockResponse()
      sinon.stub(User, 'findById').returns(Promise.resolve({}))

      await login(req, res)

      assert(res.status.calledWith(403))
      assert(res.send.calledOnce)
      const calledWith = JSON.parse(res.send.getCall(0).args[0])
      expect(calledWith.error).to.be.equals('Wrong pass')
    })

    it('Should reject login with unregistered user nor passkey provided', async () => {
      const req = mockRequest({ body: { user: 'nobody' } })
      const res = mockResponse()
      sinon.stub(User, 'findById').returns(Promise.resolve({ undefined }))

      await login(req, res)

      assert(res.status.calledWith(403))
      assert(res.send.calledOnce)
      const calledWith = JSON.parse(res.send.getCall(0).args[0])
      expect(calledWith.error).to.be.equals('Wrong pass')
    })

    it('Should reject login with registered user but no passkey provided', async () => {
      const req = mockRequest({ body: { user: 'mike' } })
      const res = mockResponse()
      sinon.stub(User, 'findById').returns(Promise.resolve({}))

      await login(req, res)

      assert(res.status.calledWith(403))
      assert(res.send.calledOnce)
      const calledWith = JSON.parse(res.send.getCall(0).args[0])
      expect(calledWith.error).to.be.equals('Wrong pass')
    })

    it('Should reject login with no user provided and wrong passkey provided', async () => {
      const req = mockRequest({ body: { pass: 'wrongpass' } })
      const res = mockResponse()
      sinon.stub(User, 'findById').returns(Promise.resolve({}))

      await login(req, res)

      assert(res.status.calledWith(403))
      assert(res.send.calledOnce)
      const calledWith = JSON.parse(res.send.getCall(0).args[0])
      expect(calledWith.error).to.be.equals('Wrong pass')
    })

    it('Should reject login with unregistered user and wrong passkey provided', async () => {
      const req = mockRequest({ body: { user: 'nobody', pass: 'wrongpass' } })
      const res = mockResponse()
      sinon.stub(User, 'findById').returns(Promise.resolve({ undefined }))

      await login(req, res)

      assert(res.status.calledWith(403))
      assert(res.send.calledOnce)
      const calledWith = JSON.parse(res.send.getCall(0).args[0])
      expect(calledWith.error).to.be.equals('Wrong pass')
    })

    it('Should reject login with registered user but wrong passkey provided', async () => {
      const req = mockRequest({ body: { user: 'mike', pass: 'wrongpass' } })
      const res = mockResponse()
      sinon.stub(User, 'findById').returns(Promise.resolve({}))

      await login(req, res)

      assert(res.status.calledWith(403))
      assert(res.send.calledOnce)
      const calledWith = JSON.parse(res.send.getCall(0).args[0])
      expect(calledWith.error).to.be.equals('Wrong pass')
    })

    it('Should reject login with unregistered user', async () => {
      const req = mockRequest({ body: { user: 'nobody', pass: secretpass } })
      const res = mockResponse()
      sinon.stub(User, 'findById').returns(Promise.resolve(undefined))

      await login(req, res)

      assert(res.status.calledWith(403))
      assert(res.send.calledOnce)
      const calledWith = JSON.parse(res.send.getCall(0).args[0])
      expect(calledWith.error).to.be.equals('User not signed')
    })

    it('Should accept login with registered user', async () => {
      const req = mockRequest({ body: { user: 'mike', pass: secretpass } })
      const res = mockResponse()
      sinon.stub(User, 'findById').returns(Promise.resolve({}))

      await login(req, res)

      assert(res.status.notCalled)
      assert(res.send.calledOnce)
      assert(JWT.signToken.calledWith({ user: 'mike' }))
      const responseBody = JSON.parse(res.send.getCall(0).args[0])
      expect(responseBody.token).to.be.equals('-mock-token')
    })
  })
})
