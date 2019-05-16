import { signToken, jwt_secret } from '../../auth/jwt'
import User from '../../model/User'
import {
  getToken,
  getUserInfo,
  getUserEmail,
  CALLBACK_URI,
} from '../../auth/github'
import { user_authenticated, user_created } from '../../events/auth'

const payload = user => ({
  id: user._id,
  role: user.role,
})

export const login = async (req, res) => {
  const userId = req.body.user
  const pass = req.body.pass

  if (!(pass && pass == jwt_secret)) {
    res.status(403).send(JSON.stringify({ error: 'Wrong pass' }))
    return
  }

  if (!(userId && userId !== '')) {
    res.status(403).send(JSON.stringify({ error: 'No user provided' }))
    return
  }

  const user = await User.findById(userId)
  if (user) {
    const toBeSigned =
      user.role == 'admin' ? { user: userId, admin: true } : { user: userId }
    const access_token = signToken(toBeSigned)

    res.dispatch(user_authenticated(payload(user)))
    res.send(JSON.stringify({ access_token }))
  } else {
    res.status(403).send(JSON.stringify({ error: 'User not signed' }))
  }
}

export const oauth_redirect = async (req, res) => {
  try {
    console.log('Getting token')
    const gh_token = await getToken(req.query.code) // Fetch token from GitHub API
    const user_email = await getUserEmail(gh_token) // Fetch user email from GitHub API

    let user = await User.findById(user_email)
    if (user) {
      // If user was already registered
      res.dispatch(user_authenticated(payload(user)))
      console.log('User authenticated: ', user._id)
    } else {
      // If new user in the system
      const user_info = await getUserInfo(gh_token)
      const userBase = {
        role: 'user',
        crypto: { public: 'public-key', private: 'private-hashed-key' },
      }
      user = new User({
        _id: user_email,
        name: user_info.login,
        ...userBase,
      })
      user = await user.save()
      res.dispatch(user_created(payload(user)))
      console.log('New user created: ', user._id)
    }
    const token = signToken({ user: user._id, admin: user.role == 'admin' })
    res.redirect(`${CALLBACK_URI}/?access_token=${token}`)
  } catch (error) {
    console.log(error)
    res.status(404).send('Error authenticating')
  }
}
