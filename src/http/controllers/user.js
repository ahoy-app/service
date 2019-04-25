import { signToken } from '../../auth/jwt'

export const login = (req, res) => {
  const user = req.body.user

  if (user && user !== '') {
    if (['mike', 'tom', 'hannah'].includes(user)) {
      const token = signToken({ user })
      res.send(JSON.stringify({ token }))
    } else {
      res.status(403).send(JSON.stringify({ error: 'User not signed' }))
    }
  } else {
    res.status(403).send(JSON.stringify({ error: 'No user provided' }))
  }
}
