import sinon from 'sinon'
import { assert, expect } from 'chai'

import { mockRequest, mockResponse } from '../../utils/mock-req-res'

import { login } from '../../../src/http/controllers/user'
import * as JWT from '../../../src/auth/jwt'

describe('User Controller', () => {
  describe('Login route', () => {
    before(() => {
      sinon.stub(JWT, 'signToken').returns('-mock-token')
    })

    after(() => {
      sinon.restore()
    })

    it('Should reject login with no user provided', () => {
      const req = mockRequest()
      const res = mockResponse()

      login(req, res)

      assert(res.status.calledWith(403))
      assert(res.send.calledOnce)
      const calledWith = JSON.parse(res.send.getCall(0).args[0])
      expect(calledWith.error).to.be.equals('No user provided')
    })

    it('Should reject login with unregistered user', () => {
      const req = mockRequest({ body: { user: 'nobody' } })
      const res = mockResponse()

      login(req, res)

      assert(res.status.calledWith(403))
      assert(res.send.calledOnce)
      const calledWith = JSON.parse(res.send.getCall(0).args[0])
      expect(calledWith.error).to.be.equals('User not signed')
    })

    it('Should accept login with registered user', () => {
      const req = mockRequest({ body: { user: 'mike' } })
      const res = mockResponse()

      login(req, res)

      assert(res.status.notCalled)
      assert(res.send.calledOnce)
      assert(JWT.signToken.calledWith({ user: 'mike' }))
      const responseBody = JSON.parse(res.send.getCall(0).args[0])
      expect(responseBody.token).to.be.equals('-mock-token')
    })
  })
})
