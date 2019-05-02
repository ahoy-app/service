import { signToken, jwt_secret } from '../../auth/jwt'
import User from '../../model/User'
import { getToken, getUserInfo, getUserEmail } from '../../auth/github'

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
    const token = signToken({ user: userId })
    res.send(JSON.stringify({ token }))
  } else {
    res.status(403).send(JSON.stringify({ error: 'User not signed' }))
  }
}

export const oauth_redirect = async (req, res) => {
  try {
    console.log('Getting token')
    const gh_token = await getToken(req.query.code) // Fetch token from GitHub API
    const user_email = await getUserEmail(gh_token) // Fetch user email from GitHub API

    const user = await User.findById(user_email)
    if (user) {
      // If user was already registered
      console.log('User authenticated: ', user_email)
    } else {
      // If new user in the system
      const user_info = await getUserInfo(gh_token)
      const userBase = {
        role: 'user',
        crypto: { public: 'public-key', private: 'private-hashed-key' },
      }
      const user = new User({
        _id: user_email,
        name: user_info.login,
        ...userBase,
      })
      await user.save()
      console.log('New user created: ', user_email)
    }
    const token = signToken({ user: user._id })
    res.redirect(`/callback.html?access_token=${token}`)
  } catch (error) {
    console.log(error)
    res.status(404).send('Error authenticating')
  }
}

// export const auth_redirect = async (req, res) => {
//
// }
