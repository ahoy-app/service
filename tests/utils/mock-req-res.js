import { spy, stub } from 'sinon'

export const mockRequest = (options = {}) => ({
  body: {},
  cookies: {},
  query: {},
  params: {},
  headers: {},
  get: stub(),
  ...options,
})

export const mockResponse = (options = {}) => {
  const res = {
    cookie: spy(),
    clearCookie: spy(),
    download: spy(),
    format: spy(),
    json: spy(),
    jsonp: spy(),
    send: spy(),
    sendFile: spy(),
    sendStatus: spy(),
    setHeader: spy(),
    redirect: spy(),
    render: spy(),
    end: spy(),
    set: spy(),
    type: spy(),
    get: stub(),
    dispatch: stub(),
    ...options,
  }
  res.status = stub().returns(res)
  res.vary = stub().returns(res)
  return res
}
