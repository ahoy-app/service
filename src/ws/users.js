// Get user info from headers
const userInfo = (props, next) => {
  const { req } = props
  props.ip = req.connection.remoteAddress
  // console.log(req.headers)
  // console.log(req.headers['Authorization'])
  props.rooms = ['room.main', 'room.football']
  console.log(`Connection created ${props.ip}`)
  next()
}

export default [userInfo]
