import { signToken } from '../../auth/jwt'
import User from '../../model/User'

export const login = async (req, res) => {
  const userId = req.body.user

  if (userId && userId !== '') {
    const user = await User.findById(userId)

    if (user) {
      const token = signToken({ user: userId })
      res.send(JSON.stringify({ token }))
    } else {
      res.status(403).send(JSON.stringify({ error: 'User not signed' }))
    }
  } else {
    res.status(403).send(JSON.stringify({ error: 'No user provided' }))
  }
}
