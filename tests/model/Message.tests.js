import { expect } from 'chai'

import { default as Message, FILE_REGEXP } from '../../src/model/Message'

describe('Message model', () => {
  const validTextMessage = {
    from: 'me',
    to: 'you',
    type: 'text',
    content: 'My content',
  }

  const validImageMessage = {
    from: 'me',
    to: 'you',
    type: 'image',
    content: 'http://mysite.com',
  }

  describe('General Message', () => {
    it('Should be invalid if nothing is provided', done => {
      var message = new Message({})

      message.validate(err => {
        expect(err.errors).to.exist
        done()
      })
    })

    it('Should be invalid if no from is provided', done => {
      // eslint-disable-next-line no-unused-vars
      const { from, ...invalidTextMessage } = validTextMessage
      var message = Message({ ...invalidTextMessage })

      message.validate(err => {
        expect(err.errors).to.include.keys('from')
        done()
      })
    })

    it('Should be invalid if from is empty', done => {
      var message = Message({ ...validTextMessage, from: '' })

      message.validate(err => {
        expect(err.errors).to.include.keys('from')
        done()
      })
    })

    it('Should be invalid if no to is provided', done => {
      // eslint-disable-next-line no-unused-vars
      const { to, ...invalidTextMessage } = validTextMessage
      var message = Message({ ...invalidTextMessage })

      message.validate(err => {
        expect(err.errors).to.include.keys('to')
        done()
      })
    })

    it('Should be invalid if no to is provided', done => {
      var message = Message({ ...validTextMessage, to: '' })

      message.validate(err => {
        expect(err.errors).to.include.keys('to')
        done()
      })
    })

    it('Should be invalid if no type is provided', done => {
      // eslint-disable-next-line no-unused-vars
      const { type, ...invalidTextMessage } = validTextMessage
      var message = Message({ ...invalidTextMessage })

      message.validate(err => {
        expect(err.errors).to.include.keys('type')
        done()
      })
    })

    it('Should be invalid if a wrong type is provided', done => {
      var message = Message({ ...validTextMessage, type: 'invalid-type' })

      message.validate(err => {
        expect(err.errors).to.include.keys('type')
        done()
      })
    })

    it('Should be invalid if no content is provided', done => {
      // eslint-disable-next-line no-unused-vars
      const { content, ...invalidTextMessage } = validTextMessage
      var message = Message({ ...invalidTextMessage })

      message.validate(err => {
        expect(err.errors).to.include.keys('content')
        done()
      })
    })
    it('Should be invalid if no content is empty', done => {
      var message = Message({ ...validTextMessage, content: '' })

      message.validate(err => {
        expect(err.errors).to.include.keys('content')
        done()
      })
    })
  })

  describe('Text Message', () => {
    it('Should be valid if all fields are provided and correct', done => {
      var message = new Message(validTextMessage)

      message.validate(err => {
        expect(err).to.not.exist
        done()
      })
    })
  })

  describe('Image message model', () => {
    it('Should be invalid if content is not a valid URI', done => {
      var message = new Message({ ...validImageMessage, content: 'not-an-uri' })

      message.validate(err => {
        expect(err.errors).to.include.keys('content')
        done()
      })
    })
    it('Should be valid if all fields are provided and correct', done => {
      var message = new Message(validImageMessage)

      message.validate(err => {
        expect(err).to.not.exist
        done()
      })
    })
    it('Should match all regexp texts', () => {
      expect('http://mysite.com').to.match(FILE_REGEXP)
      expect('https://mysite.com').to.match(FILE_REGEXP)
      expect('s3://mysite.com').to.match(FILE_REGEXP)

      expect('http://sub.mysite.com').to.match(FILE_REGEXP)
      expect('https://sub.mysite.com').to.match(FILE_REGEXP)
      expect('s3://sub.mysite.com').to.match(FILE_REGEXP)

      expect('http://host').to.match(FILE_REGEXP)
      expect('https://host').to.match(FILE_REGEXP)
      expect('s3://host').to.match(FILE_REGEXP)

      expect('A normal text message').to.not.match(FILE_REGEXP)
      expect('ftp://mysite.com').to.not.match(FILE_REGEXP)
    })
  })
})
